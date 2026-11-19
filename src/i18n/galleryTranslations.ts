import { Lang, Tr } from './LanguageContext';

type Titles = Partial<Record<Exclude<Lang, 'fr'>, string>>;

// Légendes de la galerie, par nom de fichier. Le français reste dans src/data/gallery.ts (valeur de repli).
export const galleryTitles: Record<string, Titles> = {
    'osmoseur-chd-zou.jpg': { en: 'Water treatment unit at CHD-Zou', tr: 'CHD-Zou su arıtma ünitesi', zh: 'CHD-Zou 水处理装置', ru: 'Установка водоподготовки в CHD-Zou' },
    'mesure-tds.jpg': { en: 'Measuring the TDS of water', tr: 'Suyun TDS değerinin ölçümü', zh: '水的TDS值测量', ru: 'Измерение TDS воды' },
    'prototype-electronique.jpg': { en: 'Electronic prototype on a breadboard', tr: 'Deney tahtası üzerinde elektronik prototip', zh: '面包板上的电子原型', ru: 'Электронный прототип на макетной плате' },
    'mor-eyes-banc-de-test.jpg': { en: 'MOR-EYES test bench', tr: 'MOR-EYES test düzeneği', zh: 'MOR-EYES 测试台', ru: 'Испытательный стенд MOR-EYES' },
    'mor-eyes-servomoteurs.jpg': { en: 'Servo motors of the test bench', tr: 'Test düzeneğinin servo motorları', zh: '测试台的伺服电机', ru: 'Серводвигатели испытательного стенда' },
    'mor-eyes-prototype.jpg': { en: 'MOR-EYES in front of its interface', tr: 'MOR-EYES ve arayüzü', zh: 'MOR-EYES 与其操作界面', ru: 'MOR-EYES перед своим интерфейсом' },
    'ppg-signal-brut.jpg': { en: 'PPG signal extracted from face video', tr: 'Yüz videosundan elde edilen PPG sinyali', zh: '从面部视频提取的PPG信号', ru: 'PPG-сигнал, полученный из видео лица' },
    'dicom-coupe-ct.jpg': { en: 'DICOM Anonymizer: anonymized CT slice', tr: 'DICOM Anonymizer: anonimleştirilmiş BT kesiti', zh: 'DICOM Anonymizer：已匿名化的CT切片', ru: 'DICOM Anonymizer: анонимизированный КТ-срез' },
    'dicom-verification-serie.jpg': { en: 'DICOM Anonymizer: series verification', tr: 'DICOM Anonymizer: serinin doğrulanması', zh: 'DICOM Anonymizer：序列校验', ru: 'DICOM Anonymizer: проверка серии' },
    'fusion-manometre.jpg': { en: 'Pressure gauge modeled in Fusion', tr: "Fusion'da modellenen manometre", zh: '用 Fusion 建模的压力表', ru: 'Манометр, смоделированный в Fusion' },
    'dht11-lcd.jpg': { en: 'Temperature and humidity station (DHT11)', tr: 'Sıcaklık ve nem istasyonu (DHT11)', zh: '温湿度监测站（DHT11）', ru: 'Станция температуры и влажности (DHT11)' },
    'dht11-code-arduino.jpg': { en: 'Programming the DHT11 sensor in Arduino IDE', tr: "Arduino IDE'de DHT11 sensörünün programlanması", zh: '在 Arduino IDE 中为 DHT11 传感器编程', ru: 'Программирование датчика DHT11 в Arduino IDE' },
    'fusion-pose-reservoir.jpg': { en: 'Tank mounting platform (Fusion)', tr: 'Depo yerleştirme platformu (Fusion)', zh: '水箱安装平台（Fusion）', ru: 'Платформа для установки резервуара (Fusion)' },
    'ultrason-lcd.jpg': { en: 'Distance measurement with ultrasound', tr: 'Ultrasonik mesafe ölçümü', zh: '超声波测距', ru: 'Измерение расстояния ультразвуком' },
    'radar-ultrason.jpg': { en: 'Ultrasonic radar on a servo motor', tr: 'Servo motor üzerinde ultrasonik radar', zh: '伺服电机上的超声波雷达', ru: 'Ультразвуковой радар на серводвигателе' },
    'fusion-bras.jpg': { en: '“Arm” part modeled in Fusion', tr: "Fusion'da modellenen “kol” parçası", zh: '用 Fusion 建模的“臂”零件', ru: 'Деталь «рычаг», смоделированная в Fusion' },
    'detection-main-mediapipe.jpg': { en: 'Hand detection with OpenCV and MediaPipe', tr: 'OpenCV ve MediaPipe ile el algılama', zh: '使用 OpenCV 和 MediaPipe 的手部检测', ru: 'Обнаружение руки с OpenCV и MediaPipe' },
    'matlab-emg.jpg': { en: 'Filtering and spectrum of an EMG signal (MATLAB)', tr: 'EMG sinyalinin filtrelenmesi ve spektrumu (MATLAB)', zh: '肌电信号的滤波与频谱（MATLAB）', ru: 'Фильтрация и спектр ЭМГ-сигнала (MATLAB)' },
    'mor-eyes-pro-banc.jpg': { en: 'MOR-EYES PRO: interface and mock-up', tr: 'MOR-EYES PRO: arayüz ve maket', zh: 'MOR-EYES PRO：界面与模型', ru: 'MOR-EYES PRO: интерфейс и макет' },
    'kicad-carte-esp32.jpg': { en: 'ESP32 board designed in KiCad', tr: "KiCad'de tasarlanan ESP32 kartı", zh: '用 KiCad 设计的 ESP32 电路板', ru: 'Плата на ESP32, разработанная в KiCad' },
    'blender-phare.jpg': { en: 'Lighthouse modeled in Blender', tr: "Blender'da modellenen deniz feneri", zh: '用 Blender 建模的灯塔', ru: 'Маяк, смоделированный в Blender' },
    'medora-solidworks.jpg': { en: 'MEDORA: voice medical assistant (SolidWorks)', tr: 'MEDORA: sesli tıbbi asistan (SolidWorks)', zh: 'MEDORA：语音医疗助手（SolidWorks）', ru: 'MEDORA: голосовой медицинский помощник (SolidWorks)' },
    'bras-servomoteurs.jpg': { en: 'Articulated arm with servo motors', tr: 'Servo motorlu mafsallı kol', zh: '伺服电机驱动的关节臂', ru: 'Шарнирная рука на серводвигателях' },
    'regression-fonction-cout.jpg': { en: 'Linear regression: cost function J(w, b)', tr: 'Doğrusal regresyon: maliyet fonksiyonu J(w, b)', zh: '线性回归：代价函数 J(w, b)', ru: 'Линейная регрессия: функция потерь J(w, b)' },
    'proteus-table-chauffante.jpg': { en: 'Heating plate simulated in Proteus', tr: "Proteus'ta simüle edilen ısıtma tablası", zh: '在 Proteus 中仿真的加热板', ru: 'Нагревательная плита, смоделированная в Proteus' },
    'openscad-modelisation.jpg': { en: 'Parametric modeling in OpenSCAD', tr: "OpenSCAD'de parametrik modelleme", zh: '在 OpenSCAD 中进行参数化建模', ru: 'Параметрическое моделирование в OpenSCAD' },
    'kicad-detecteur-presence-3d.jpg': { en: 'Presence detector: 3D view in KiCad', tr: 'Varlık dedektörü: KiCad 3B görünümü', zh: '人体存在探测器：KiCad 三维视图', ru: 'Датчик присутствия: 3D-вид в KiCad' },
    'fusion-robinet.jpg': { en: 'Tap modeled in Fusion', tr: "Fusion'da modellenen musluk", zh: '用 Fusion 建模的水龙头', ru: 'Кран, смоделированный в Fusion' },
    'webots-epuck-controleur.jpg': { en: 'e-puck robot simulated in Webots', tr: "Webots'ta simüle edilen e-puck robotu", zh: '在 Webots 中仿真的 e-puck 机器人', ru: 'Робот e-puck в симуляции Webots' },
    'webots-epuck-simulation.jpg': { en: 'Mobile robot simulation (Webots)', tr: 'Mobil robot simülasyonu (Webots)', zh: '移动机器人仿真（Webots）', ru: 'Симуляция мобильного робота (Webots)' },
    'led-gestuelle-mediapipe.jpg': { en: 'Gesture-controlled LED (MediaPipe)', tr: 'Jestlerle LED kontrolü (MediaPipe)', zh: '手势控制 LED（MediaPipe）', ru: 'Управление светодиодом жестами (MediaPipe)' },
    'mor-eyes-pro-tutoriel.jpg': { en: 'MorEyes Pro: blinking tutorial', tr: 'MorEyes Pro: göz kırpma eğitimi', zh: 'MorEyes Pro：眨眼教程', ru: 'MorEyes Pro: обучение морганию' },
    'bras-servo-maquette.jpg': { en: 'Servo-driven arm mock-up (Arduino)', tr: 'Servo motorlu kol maketi (Arduino)', zh: '伺服电机臂模型（Arduino）', ru: 'Макет руки с серводвигателем (Arduino)' },
    'mor-eyes-pro-phrases.jpg': { en: 'MorEyes Pro: quick phrases', tr: 'MorEyes Pro: hızlı cümleler', zh: 'MorEyes Pro：快捷短语', ru: 'MorEyes Pro: быстрые фразы' },
    'kicad-attiny85-schema.jpg': { en: 'ATtiny85 schematic in KiCad', tr: "KiCad'de ATtiny85 şeması", zh: 'KiCad 中的 ATtiny85 原理图', ru: 'Схема ATtiny85 в KiCad' },
    'kicad-attiny85-3d.jpg': { en: 'ATtiny85 board: 3D view (KiCad)', tr: 'ATtiny85 kartı: 3B görünüm (KiCad)', zh: 'ATtiny85 电路板：三维视图（KiCad）', ru: 'Плата ATtiny85: 3D-вид (KiCad)' },
};

export const galleryCategories: Record<string, Tr> = {
    'Terrain': { fr: 'Terrain', en: 'Field work', tr: 'Saha', zh: '现场', ru: 'Работа на объекте' },
    'Électronique': { fr: 'Électronique', en: 'Electronics', tr: 'Elektronik', zh: '电子', ru: 'Электроника' },
    'Logiciel': { fr: 'Logiciel', en: 'Software', tr: 'Yazılım', zh: '软件', ru: 'Программы' },
    'Modélisation 3D': { fr: 'Modélisation 3D', en: '3D modeling', tr: '3B modelleme', zh: '三维建模', ru: '3D-моделирование' },
};
