package messages;

import java.io.Serializable;

public class NextMessage implements Serializable {
    public int clientId;

    public NextMessage(int clientId) {
        this.clientId = clientId;
    }
}
