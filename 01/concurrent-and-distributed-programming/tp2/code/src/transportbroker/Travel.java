package transportbroker;

import akka.actor.ActorRef;

/**
 * Travel Class that contains travel data
 */
public class Travel {
    public int id;
    public String origin;
    public String destination;
    public ActorRef providerActor;
    public String providerName;
    public int clientId;
    public int cost;
    public int time;

    public Travel(int id, String origin, String destination) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
    }

    public Travel(int id, String origin, String destination, ActorRef providerActor, String providerName, int clientId, int cost, int time) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
        this.providerActor = providerActor;
        this.providerName = providerName;
        this.clientId = clientId;
        this.cost = cost;
        this.time = time;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }
}
