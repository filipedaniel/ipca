package actors;

import akka.actor.ActorRef;
import akka.actor.UntypedActor;
import messages.*;
import org.json.simple.JSONObject;
import scala.concurrent.duration.FiniteDuration;
import transportbroker.JsonFilesParams;
import transportbroker.Travel;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;


public class ProviderActor extends UntypedActor {
    private JsonFilesParams provider;
    private JsonFilesParams traveltimes;
    private boolean PROVIDER_AVAILABLE = true;
    private static final DateFormat sdf = new SimpleDateFormat("HH:mm:ss");


    public ProviderActor(JsonFilesParams provider, JsonFilesParams traveltimes) {
        this.provider = provider;
        this.traveltimes = traveltimes;
    }


    public void onReceive(Object message) {

        if (message instanceof CostOfTravelQuestionMessage) {

            Travel travel = ((CostOfTravelQuestionMessage) message).travel;

            String origin = travel.getOrigin();
            String destination = travel.getDestination();

            JSONObject providerCostsTemp = (JSONObject) ((JSONObject) (this.provider.getData()).get(origin));
            Object costTemp = providerCostsTemp.get(destination);
            int cost = ((Long) costTemp).intValue();

            JSONObject travelTimeTemp = (JSONObject) ((JSONObject) (this.traveltimes.getData()).get(origin));
            Object timeTemp = travelTimeTemp.get(destination);

            int time = ((Long) timeTemp).intValue();

            getSender().tell(new CostOfTravelAnswerMessage(travel,cost, time, this.provider.getTitle()), getSelf());

        } else {
            if (message instanceof BeginTravelRequestMessage) {

                Travel t = ((BeginTravelRequestMessage) message).travel;
                if (PROVIDER_AVAILABLE) {
                    this.PROVIDER_AVAILABLE = false;

                    Date date = new Date();

                    System.out.print(sdf.format(date) + " Viagem " + t.getId() + " - " + t.providerName + " - Custo: " + t.cost + " - " + t.time + "s ... ");
                    context().system().scheduler().scheduleOnce(new FiniteDuration(t.time, TimeUnit.SECONDS), getSelf(), new InternalEndTravelMessage(t,getSender()), context().dispatcher(), ActorRef.noSender());
                } else {
                    getSender().tell(new NotAvailableMessage(t),getSelf());
                }

            } else {
                if (message instanceof InternalEndTravelMessage) {
                    Travel t = ((InternalEndTravelMessage) message).travel;
                    ActorRef client = ((InternalEndTravelMessage) message).client;
                    this.PROVIDER_AVAILABLE = true;
                    Date date = new Date();
                    System.out.println(sdf.format(date) + " End");
                    client.tell(new EndTravelMessage(t), getSelf());
                } else {
                    unhandled(message);
                }
            }
        }
    }
}