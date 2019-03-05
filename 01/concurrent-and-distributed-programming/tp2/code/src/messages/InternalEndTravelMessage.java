package messages;

import akka.actor.ActorRef;
import transportbroker.Travel;

import java.io.Serializable;

public class InternalEndTravelMessage implements Serializable {
    public final Travel travel;
    public final ActorRef client;

    public InternalEndTravelMessage(Travel t, ActorRef a) {
        this.travel = t;
        this.client = a;
    }
}
