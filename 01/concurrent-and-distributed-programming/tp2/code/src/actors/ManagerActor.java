package actors;

import akka.actor.ActorRef;
import akka.actor.UntypedActor;
import messages.*;
import org.json.simple.JSONObject;
import transportbroker.Travel;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;

public class ManagerActor extends UntypedActor {
    private ActorRef[] clientActors;
    private LinkedList<Travel> travels;
    private int totalOfTravels;
    private boolean alreayDone;

    private Map<Integer,Travel> endTravels = new HashMap<>();
    private Map<Integer,Travel> inTravel= new HashMap<>();


    public ManagerActor(ActorRef[] clientsActors, JSONObject travels) {
        this.clientActors = clientsActors;
        // list of travels
        this.travels = jsonObjectToLinkedList(travels);
        this.totalOfTravels = this.travels.size();
    }


    public void onReceive(Object message) throws InterruptedException {

        if (message instanceof StartMessage) {

            for (int i = 0; i < this.clientActors.length && i < this.totalOfTravels; i++) {
                boolean found = false;
                int j = i;
                // We need to ensure that each client makes a trip that has not yet been made or is in progress.
                while (!found) {
                    Travel t = this.travels.get(j);
                    if (!this.inTravel.containsKey(t.getId()) && !this.endTravels.containsKey(t.getId())) {
                        t.clientId = i;
                        this.inTravel.put(t.id,t);
                        this.clientActors[i].tell(new NewTravelMessage(t), getSelf());
                        found = true;
                    } else { j++; }
                }
            }

        } else {
            if (message instanceof NextMessage) {
                int clientId = ((NextMessage) message).clientId;

                boolean found = false;

                int j = 0;
                while (!found) {
                    if (this.endTravels.size() < this.totalOfTravels && j < this.totalOfTravels) {
                        Travel t = this.travels.get(j);
                        if (!this.inTravel.containsKey(t.getId()) && !this.endTravels.containsKey(t.getId())) {
                            t.clientId = clientId;
                            this.inTravel.put(t.id,t);
                            this.clientActors[clientId].tell(new NewTravelMessage(t), getSelf());
                            found = true;
                        } else { j++; }
                    } else {
                        found = true;
                    }
                }

            } else {
                if (message instanceof EndTravelMessage) {
                    Travel endTravel = ((EndTravelMessage) message).travel;

                    this.endTravels.put(endTravel.getId(),endTravel);
                    this.inTravel.remove(endTravel.getId());

                    if (this.endTravels.size() == this.totalOfTravels) {
                        if (!this.alreayDone) {
                            this.alreayDone = true;
                            Thread.sleep(400);
                            System.out.println("------------------------------------------------------------------------");
                            printMap(this.endTravels);

                            getContext().system().shutdown();
                        }
                    } else {
                        getSelf().tell(new NextMessage(endTravel.clientId), getSelf());
                    }

                } else {
                    unhandled(message);
                }

            }
        }
    }

    private LinkedList<Travel> jsonObjectToLinkedList(JSONObject objTravels) {
        LinkedList<Travel> travels = new LinkedList<Travel>();

        for(int i = 1; i <= objTravels.size(); i++) {
            JSONObject obj = (JSONObject) objTravels.get(""+i);
            travels.add(new Travel(i,(String) obj.get("origin"),(String)obj.get("destination")));
        }

        return travels;
    }

    public static void printMap(Map mp) {
        Iterator it = mp.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            Travel val = (Travel) pair.getValue();
            System.out.println("Cliente ID " + val.clientId + " - Viagem: " + pair.getKey() + " (" + val.getOrigin() + ", " + val.getDestination() + ") - Cost: " + val.cost + " (" + val.providerName + ")");
            it.remove();
        }
    }
}
