package messages;

import transportbroker.Travel;

import java.io.Serializable;

public class EndTravelMessage implements Serializable {
    public final Travel travel;

    public EndTravelMessage(Travel travel) {
        this.travel = travel;
    }
}
