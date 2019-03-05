package messages;

import transportbroker.Travel;
import java.io.Serializable;

@SuppressWarnings("serial")
public class CostOfTravelAnswerMessage implements Serializable {
    public final Travel travel;
    public final int cost;
    public final int time;
    public final String providerName;


    public CostOfTravelAnswerMessage(Travel travel, int cost, int time, String providerName) {
        this.travel = travel;
        this.providerName = providerName;
        this.cost = cost;
        this.time = time;
    }
}