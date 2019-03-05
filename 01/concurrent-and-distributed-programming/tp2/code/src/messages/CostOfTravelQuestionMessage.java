package messages;

import transportbroker.Travel;

import java.io.Serializable;

@SuppressWarnings("serial")
public class CostOfTravelQuestionMessage implements Serializable {
    public Travel travel;

    public CostOfTravelQuestionMessage(Travel travel) {
        this.travel = travel;
    }
}