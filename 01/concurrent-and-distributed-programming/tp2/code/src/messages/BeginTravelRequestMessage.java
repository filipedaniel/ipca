package messages;

import transportbroker.Travel;

import java.io.Serializable;

@SuppressWarnings("serial")
public class BeginTravelRequestMessage implements Serializable {
    public final Travel travel;

    public BeginTravelRequestMessage(Travel travel) {
        this.travel = travel;
    }
}
