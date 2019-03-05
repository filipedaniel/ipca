package transportbroker;
import org.json.simple.JSONObject;

/**
 * Content structure of json files
 */
public class JsonFilesParams {
    private String title;
    private JSONObject data;

    public JsonFilesParams() { }

    public JsonFilesParams(String title, JSONObject data) {
        this.title = title;
        this.data = data;
    }

    public String getTitle() {
        return this.title;
    }

    public JSONObject getData() {
        return this.data;
    }

}