package messages;

import transportbroker.Travel;

import java.io.Serializable;

public class NotAvailableMessage implements Serializable {
    public final Travel travel;

    public NotAvailableMessage(Travel t) {
        this.travel = t;
    }
}
