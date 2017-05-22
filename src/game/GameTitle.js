/** @constructor */
GameTitle =
{
  game: null,

  projectInfo: null,

  settings:
  {
    local:
    {
      mute: false
    },
    session:
    {

   }
 },

  screenWidth: 960,
  screenHeight: 540,

  titleStyle: {font: "144px Arial", fill: "#ffffff", stroke: "#000000", strokeThickness: 8},
  
  activeButton: null,

  backButtonCallback: null,

  gamepadList: [],
  gamepadMenuCallbackList: [],
  lastGamepadYAxis: 0.0,

  platformSystem: null
};

GameTitle.run = function()
{
  this.game = new Phaser.Game(this.screenWidth, this.screenHeight, Phaser.AUTO, "", this);

  this.platformSystem = new GameTitle.PlatformSystem(this.game);
  this.platformSystem.init();

  this.game.state.add(GameTitle.Boot.stateKey, GameTitle.Boot);
  this.game.state.add(GameTitle.Preloader.stateKey, GameTitle.Preloader);
  this.game.state.add(GameTitle.Title.stateKey, GameTitle.Title);
  this.game.state.add(GameTitle.Game.stateKey, GameTitle.Game);
  this.game.state.add(GameTitle.About.stateKey, GameTitle.About);

  this.game.state.start(GameTitle.Boot.stateKey);
};

GameTitle.quit = function()
{
  this.platformSystem.quit();
};

GameTitle.setupGamepadsForMenu = function()
{
  this.gamepadMenuCallbackList.length = 0;
  this.gamepadMenuCallbackList.onDown = this.gamepadOnDown;
  this.gamepadMenuCallbackList.onAxis = this.gamepadOnAxis;

  this.game.input.gamepad.addCallbacks(this, this.gamepadMenuCallbackList);
};

GameTitle.gamepadOnDown = function(buttonIndex, buttonValue, gamepadIndex)
{
  console.log(buttonIndex, buttonValue, gamepadIndex);

  var cycleDirection = 0;

  switch(buttonIndex)
  {
    case Phaser.Gamepad.XBOX360_DPAD_UP:
    {
      cycleDirection = -1;
      break;
   }

    case Phaser.Gamepad.XBOX360_DPAD_DOWN:
    {
      cycleDirection = 1;
      break;
   }
 }

  if(cycleDirection !== 0)
  {
    this.cycleActiveButton(cycleDirection);
 }
  else
  {
    if(buttonIndex === Phaser.Gamepad.XBOX360_B)
    {
      this.activateButtonDown(this.activeButton);
   }
 }
};

GameTitle.gamepadOnAxis = function(gamepad, axisIndex, axisValue)
{
  console.log(axisIndex, axisValue);

  if(axisIndex === Phaser.Gamepad.XBOX360_STICK_LEFT_Y)
  {
    var cycleDirection = 0;

    if(axisValue < -0.1 && this.lastGamepadYAxis >= -0.1)
    {
      cycleDirection = -1;
   }
    else
    if(axisValue > 0.1 && this.lastGamepadYAxis <= 0.1)
    {
      cycleDirection = 1;
   }

    this.lastGamepadYAxis = axisValue;

    if(cycleDirection !== 0)
    {
      this.cycleActiveButton(cycleDirection);
   }
 }
};

GameTitle.setupTitleAndText = function(state, menuSystem)
{
  // Title.
  var titleTextX = this.game.camera.width / 2;
  var titleTextY = ((this.game.camera.height * (1 - 0.67)) | 0) - 36;
  
  var titleText = state.add.text(titleTextX, titleTextY,
                                  GameTitle.projectInfo.window.title, GameTitle.titleStyle);

  titleText.anchor.setTo(0.5);

  // All text.
  var allTextGroup = state.game.add.group();
  allTextGroup.add(titleText);
  allTextGroup.add(menuSystem.buttonGroup);
  allTextGroup.alpha = 0.0;
  allTextGroup.fixedToCamera = true;

  this.game.add.tween(allTextGroup).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
};

GameTitle.stopSounds = function(soundList)
{
  if(soundList === undefined)
  {
    this.game.sound.stopAll();
    return;
 }

  var sound = null;
  for(var i = 0; i < soundList.length; i++)
  {
    sound = soundList[i];
    sound.stop();
 }
};

GameTitle.getMute = function()
{
  return this.settings.local.mute;
};

GameTitle.setMute = function(mute)
{
  if(this.settings.local.mute !== mute)
  {
    this.settings.local.mute = mute;

    this.storeLocalSettings();
 }

  this.game.sound.mute = mute;
};

GameTitle.retrieveLocalSettings = function()
{
  if(typeof(Storage) === undefined)
  {
    console.warn("Local Storage not supported.");
    return;
 }

  var settingsLocal = localStorage.getItem("localSettings");
  if(settingsLocal === null)
  {
    // No local settings saved yet.
    return;
 }
  
  this.settings.local = JSON.parse(settingsLocal);

  // Do any actions that should come out of potentially changing
  // any local settings.
  this.setMute(this.settings.local.mute);
};

GameTitle.storeLocalSettings = function()
{
  if(typeof(Storage) === undefined)
  {
    console.warn("Local Storage not supported.");
    return;
 }

  localStorage.setItem("localSettings", JSON.stringify(this.settings.local));
};
