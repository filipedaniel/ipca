/*
 * List of colors for use in types
 */
public class Colors {

  HashMap<String, Color> typeColors;
  ArrayList<Color> availableColors;

  Colors () {
    typeColors = new HashMap<String, Color>();
    color[] arrayAvailableColors = { 
      #607D8B, 
      #528881, 
      #886451, 
      #99aab5, 
      #7289da
    };
    availableColors = new ArrayList<Color>();
    for (int i = 0; i < arrayAvailableColors.length; ++i) {
      availableColors.add(new Color(arrayAvailableColors[i]));
    }
    /* Set types default variables */
    typeColors.put("Florestal", new Color(#103900));
    typeColors.put("Agrícola", new Color(#918184));
    typeColors.put("Queimada", new Color(#df654a));
    typeColors.put("Falso Alarme", new Color(#4d7ea8));
    /* Set Causes default variables */
    typeColors.put("Sem Informação", new Color(#b6c2d9));
    typeColors.put("Desconhecida", new Color(#272932));
    typeColors.put("Nigligente", new Color(#a799b7));
    typeColors.put("Reacendimento", new Color(#445552));
    typeColors.put("Natural", new Color(#03A9F4));
    typeColors.put("Intencional", new Color(#653239));
  }

  Color getNextColorAvailable() {
    Color c = availableColors.get(0);
    availableColors.remove(0);
    return c;
  }

  boolean containsType(String type) {
    return typeColors.containsKey(type);
  }

  Color getColorType(String type) {
    return typeColors.get(type);
  } 

  void addTypeColor(String type, Color newTypeColor) {
    typeColors.put(type, newTypeColor);
  }
}