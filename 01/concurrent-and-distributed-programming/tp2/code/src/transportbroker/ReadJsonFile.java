package transportbroker;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * Class that reads content from json files;
 */
public class ReadJsonFile {

    public ReadJsonFile() {}

    /* Read content of file 'fileDir' */
    public JsonFilesParams readJsonFile(String fileDir) throws IOException, ParseException {
        String path = new File("").getAbsolutePath() + "/files/" + fileDir;

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(new FileReader(path));

        String title = (String) jsonObject.get("title");
        JSONObject data = (JSONObject) jsonObject.get("data");

        JsonFilesParams p = new JsonFilesParams(title, data);

        return p;
    }

    /* Read al files in the 'dirFolder' directory */
    public JsonFilesParams[] readJsonFiles(String dirFolder) throws FileNotFoundException, IOException, org.json.simple.parser.ParseException {
        String basePath = new File("").getAbsolutePath() + "/files/" + dirFolder;

        File folder = new File(basePath);

        String[] filenames = folder.list();

        JsonFilesParams[] jsonFiles = new JsonFilesParams[filenames.length];

        for (int i = 0; i < filenames.length; i++) {

            JSONParser parser = new JSONParser();

            JSONObject jsonObject = (JSONObject) parser.parse(new FileReader(basePath + "/" + filenames[i].toString()));

            String title = (String) jsonObject.get("title");
            JSONObject data = (JSONObject) jsonObject.get("data");

            JsonFilesParams p = new JsonFilesParams(title, data);
            jsonFiles[i] = p;
        }

        return jsonFiles;
    }

}