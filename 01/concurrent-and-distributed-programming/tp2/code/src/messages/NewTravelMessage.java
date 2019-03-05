package messages;

import transportbroker.Travel;

import java.io.Serializable;

/**
 * Information of new travel
 */

@SuppressWarnings("serial")
public class NewTravelMessage implements Serializable  {
    public Travel travel;

    public  NewTravelMessage(Travel t) {
        this.travel = t;
    }

}

