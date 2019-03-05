/**
 *
 * Class Year, contains info about one year, 
 * like, total of fires, total of burned area, 
 * and info about districts on this year
 *
 */
class Year {
  private String name;
  private float fires;
  private float burnedArea;
  private float originalFires;
  private float originalBurnedArea;
  private float maxDistrictFires;
  private float maxDistrictBurnedArea;  
  private String maxDistrictNameFires;
  private String maxDistrictNameBurnedArea;
  private HashMap<String, District> districts = new HashMap<String, District>();

  private float maxTypeFires;
  private float maxTypeBurnedArea;
  private String maxTypeNameFires;
  private String maxTypeNameBurnedArea;
  private HashMap<String, Type> fireTypes = new HashMap<String, Type>();

  private float maxCausesFires;
  private float maxCausesBurnedArea;
  private String maxCausesNameFires;
  private String maxCausesNameBurnedArea;
  private HashMap<String, Type> fireCauses = new HashMap<String, Type>();
  private int posX;
  private int posY;

  private float aniFires = 0;
  private float aniBurnedArea = 0;

  Year () {
    name = ""; 
    fires = 0.0; 
    burnedArea = 0.0; 
    originalFires = 0.0; 
    originalBurnedArea = 0.0; 
    districts = new HashMap<String, District>();
    fireTypes = new HashMap<String, Type>();
    fireCauses = new HashMap<String, Type>();
    posX = 0; 
    posY = 0;
  }

  Year (String n, float f, float ba, float of, float oba, HashMap<String, District> dst, HashMap<String, Type> tps, HashMap<String, Type> causes, int xx, int yy) {
    name = n;
    fires = f;
    burnedArea = ba;
    originalFires = of;
    originalBurnedArea = oba;
    districts = dst;
    fireTypes = tps;
    fireCauses = causes;
    posX = xx;
    posY = yy;
  }

  /* get methods */
  String getName() {
    return name;
  }

  float getFires() {
    return fires;
  }

  float getOriginalFires() {
    return originalFires;
  }

  float getOriginalBurnedArea() {
    return originalBurnedArea;
  }

  float getBurnedArea() {
    return burnedArea;
  }

  int getPosX() {
    return posX;
  }

  int getPosY() {
    return posY;
  }

  HashMap<String, District> getDistricts() {
    return districts;
  }

  District getDistrict(String name) {
    return (District) districts.get(name);
  }

  float getMaxDistrictFires() {
    return maxDistrictFires;
  }

  float getMaxDistrictBurnedArea() {
    return maxDistrictBurnedArea;
  }

  String getMaxDistrictNameFires() {
    return maxDistrictNameFires;
  }

  String getMaxDistrictNameBurnedArea() {
    return maxDistrictNameBurnedArea;
  }

  float getMaxTypeFires() {
    return maxTypeFires;
  }

  float getMaxTypeBurnedArea() {
    return maxTypeBurnedArea;
  }

  String getMaxTypeNameFires() {
    return maxTypeNameFires;
  }

  String getMaxTypeNameBurnedArea() {
    return maxTypeNameBurnedArea;
  }

  HashMap<String, Type> getTypes() {
    return fireTypes;
  }

  Type getType(String name) {
    return (Type) fireTypes.get(name);
  }

  float getMaxCausesFires() {
    return maxCausesFires;
  }
  float getMaxCausesBurnedArea() {
    return maxCausesBurnedArea;
  }

  String getMaxCausesNameFires() {
    return maxCausesNameFires;
  }
  String getMaxCausesNameBurnedArea() {
    return maxCausesNameBurnedArea;
  }

  HashMap<String, Type> getCauses() {
    return fireCauses;
  }

  Type getCause(String name) {
    return (Type) fireCauses.get(name);
  }


  /* set methods */
  void setFires(float tf) {
    fires = tf;
  }

  void setBurnedArea(float tba) {
    burnedArea = tba;
  }

  void setMaxDistrictFires(float mdf) {
    maxDistrictFires = mdf;
  }
  void setMaxDistrictBurnedArea(float mdba) {
    maxDistrictBurnedArea = mdba;
  }

  void setMaxDistrictNameFires(String mdnf) {
    maxDistrictNameFires = mdnf;
  }
  void setMaxDistrictNameBurnedArea(String mdnba) {
    maxDistrictNameBurnedArea = mdnba;
  }

  void setMaxTypeFires(float mtf) {
    maxTypeFires = mtf;
  }
  void setMaxTypeBurnedArea(float mtba) {
    maxTypeBurnedArea = mtba;
  }

  void setMaxTypeNameFires(String mtnf) {
    maxTypeNameFires = mtnf;
  }
  void setMaxTypeNameBurnedArea(String mtnba) {
    maxTypeNameBurnedArea = mtnba;
  }

  void setMaxCausesFires(float mtf) {
    maxCausesFires = mtf;
  }
  void setMaxCausesBurnedArea(float mtba) {
    maxCausesBurnedArea = mtba;
  }
  void setMaxCausesNameFires(String mtnf) {
    maxCausesNameFires = mtnf;
  }
  void setMaxCausesNameBurnedArea(String mtnba) {
    maxCausesNameBurnedArea = mtnba;
  }

  void setDistricts(HashMap<String, District> dts) {
    districts = dts;
  }

  void setTypes(HashMap<String, Type> tps) {
    fireTypes = tps;
  }

  void setCauses(HashMap<String, Type> cas) {
    fireCauses = cas;
  }

  void resetAnimations() {
    aniFires = 0;
    aniBurnedArea = 0;
    for (Map.Entry ds : districts.entrySet()) {
      District d = (District) ds.getValue();
      d.resetAnimations();
    }
  }

  void drawYear() {
    if (burnedArea > fires) {
      noStroke();
      fill(Consts.COLOR_BURNED_AREA, 80);
      Ani.to(this, 0.8, "aniBurnedArea", burnedArea);
      ellipse(posX, posY, aniBurnedArea, aniBurnedArea);

      noStroke();
      fill(Consts.COLOR_FIRE);
      Ani.to(this, 0.8, "aniFires", fires);
      ellipse(posX, posY, aniFires, aniFires);
    } else {
      noStroke();
      fill(Consts.COLOR_FIRE, 80);
      Ani.to(this, 0.8, "aniFires", fires);
      ellipse(posX, posY, aniFires, aniFires);

      noStroke();
      fill(Consts.COLOR_BURNED_AREA, 80);
      Ani.to(this, 0.8, "aniBurnedArea", burnedArea);
      ellipse(posX, posY, aniBurnedArea, aniBurnedArea);
    }
  }

  void drawYearInfo() {
    double dist = dist(mouseX, mouseY, posX, posY);

    if (dist < fires/2 ) {

      String l = name + "\nÁrea Ardida: " + originalBurnedArea + " ha"
        + "\nTotal de Fogos: " + int(originalFires) + " fogos";

      textAlign(CENTER); 
      fill(Consts.COLOR_TEXT_LEVEL3);
      text(l, posX, 140);

      stroke(Consts.COLOR_TEXT_LEVEL3);
      line(posX, posY, posX, 200);
    }
  }

  void drawYearDistrict(String dts) {
    District d = (District) districts.get(dts);
    d.setPosX(posX);
    d.setPosY(posY);
    d.drawDistrict();
  }

  void drawYearDistrictInfo(String dts) {
    District d = (District) districts.get(dts);
    double dist = dist(mouseX, mouseY, posX, posY);

    if (dist < d.getFires()/2 ) {
      String l = "\nÁrea Ardida: " + d.getOriginalBurnedArea() + " ha"
        + "\nTotal de Fogos: " + int(d.getOriginalFires()) + " fogos";

      textAlign(CENTER); 
      fill(Consts.COLOR_TEXT_LEVEL3);
      text(l, posX, 140);

      stroke(Consts.COLOR_TEXT_LEVEL3);
      line(posX, posY, posX, 200);
    }
  }

  void drawYearFireTypes() {
    for (Map.Entry t : fireTypes.entrySet()) {
      Type type = (Type) t.getValue();
      type.drawFireTypes();
    }
  }

  void drawYearFireCauses() {
    for (Map.Entry t : fireCauses.entrySet()) {
      Type type = (Type) t.getValue();
      //type.drawFireTypes();
      type.printDevelopInfo();
    }
  }
}