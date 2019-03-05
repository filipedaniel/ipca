/**
 *
 * Class Type, use on Fire Types and Fire Causes
 *
 */
public class Type {
  private String name;
  private float fires;
  private float burnedArea;
  private color hexColor; 

  Type () {
    name = "";
    fires = 0.0;
    burnedArea = 0.0;
  }

  Type(String n, float f, float ba) {
    name = n;
    fires = f;
    burnedArea = ba;
  }

  String getName() {
    return name;
  }

  float getFires() {
    return fires;
  }

  float getBurnedArea() {
    return burnedArea;
  }

  void setName(String n) {
    name = n;
  }

  void setFires(float f) {
    fires = f;
  }

  void setBurnedArea(float ba) {
    burnedArea = ba;
  }

  void setColor(Color hexC) {
    hexColor = hexC.getHexCode();
  }

  color getColor() {
    return hexColor;
  }

  void updateBurnedArea(float ba) {
    burnedArea += ba;
    fires++;
  }

  void drawFireTypes() {
    printDevelopInfo();
  }

  void drawInfo(float xx, float yy) {
    textAlign(LEFT);
    fill(Consts.COLOR_TEXT_LEVEL3);

    text(name+"\n"+
      "Total de Fogos: "+int(fires)+" fogos\n"+
      "Área Ardida: "+burnedArea+" ha", xx, yy);
  }

  void printDevelopInfo() {
    println("name: "+name);
    println("fires: "+fires);
    println("burnedArea: "+burnedArea);
  }
}