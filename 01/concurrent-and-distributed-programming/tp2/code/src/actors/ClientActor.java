package actors;

import messages.*;

import akka.actor.ActorRef;
import akka.actor.UntypedActor;
import transportbroker.Travel;

import java.util.*;

public class ClientActor extends UntypedActor {
    private int clientId;
    private ActorRef[] providerActors;
    private ActorRef managerActor;

    // Map all the travels by TreeMap order by cost!
    private Map<Integer, TreeMap<Integer, Travel>> mapProviderByCosts = new HashMap<>();


    public ClientActor(int clientId, ActorRef[] providerActors) {
        this.clientId = clientId;
        this.providerActors = providerActors;
    }


    public void onReceive(Object message) {

        if (message instanceof NewTravelMessage) {
            Travel travel = ((NewTravelMessage) message ).travel;
            this.managerActor = getSender();

            for(int i = 0; i < this.providerActors.length; i++) {
                this.providerActors[i].tell(new CostOfTravelQuestionMessage(travel), getSelf());
            }

        } else {
            if (message instanceof CostOfTravelAnswerMessage) {

                int cost = ((CostOfTravelAnswerMessage) message ).cost;
                int time = ((CostOfTravelAnswerMessage) message ).time;
                String providerName = ((CostOfTravelAnswerMessage) message ).providerName;

                Travel travel = ((CostOfTravelAnswerMessage) message ).travel;

                Travel newTravel = new Travel(travel.getId(),travel.getOrigin(),travel.getDestination(), getSender(),providerName, this.clientId, cost, time);

                TreeMap<Integer, Travel> providerByCosts = this.mapProviderByCosts.get(travel.getId());
                if (providerByCosts == null) { // first cost answer
                    TreeMap<Integer, Travel> temp = new TreeMap<>();
                    temp.put(cost, newTravel);
                    providerByCosts = temp;
                    this.mapProviderByCosts.put(travel.getId(), temp);
                } else {
                    boolean put = false;
                    while (!put) {
                        if (!providerByCosts.containsKey(cost)) {
                            providerByCosts.put(cost, newTravel);
                            put = true;
                        } else {
                            cost++;
                        }
                    }
                    this.mapProviderByCosts.put(travel.getId(),providerByCosts);
                }

                if (providerByCosts.size() == this.providerActors.length) {
                    Travel travelToRequest = providerByCosts.get(providerByCosts.firstKey());
                    // Remove comment for execution I and II. Comment line BeginTravelRequestMessage;
                    //this.managerActor.tell(new EndTravelMessage(travelToRequest), getSelf());
                    travelToRequest.providerActor.tell(new BeginTravelRequestMessage(travelToRequest), getSelf());
                }

            } else {
                if (message instanceof EndTravelMessage) {
                    Travel t = ((EndTravelMessage) message).travel;

                    this.managerActor.tell(new EndTravelMessage(t), getSelf());
                } else {
                    if (message instanceof NotAvailableMessage) {
                        Travel travelToRequest = ((NotAvailableMessage) message).travel;
                        getSender().tell(new BeginTravelRequestMessage(travelToRequest), getSelf());
                    } else {
                        unhandled(message);
                    }
                }
            }
        }
    }
}