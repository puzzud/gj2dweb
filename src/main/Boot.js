/** @constructor */
GameTitle.Boot = function(game)
{
  
};

GameTitle.Boot.stateKey = "Boot";

GameTitle.Boot.prototype.init = function()
{
  this.stage.disableVisibilityChange = false;
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.minWidth = (this.screenWidth / 2) | 0;
  this.scale.minHeight = (this.screenHeight / 2) | 0;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.stage.forcePortrait = true;

  this.input.maxPointers = 1;
  this.input.addPointer();

  this.stage.backgroundColor = 0x000000;

  this.game.input.gamepad.start();
  GameTitle.gamepadList.push(this.game.input.gamepad.pad1);
  GameTitle.gamepadList.push(this.game.input.gamepad.pad2);
  GameTitle.gamepadList.push(this.game.input.gamepad.pad3);
  GameTitle.gamepadList.push(this.game.input.gamepad.pad4);
};

GameTitle.Boot.prototype.preload = function()
{
  this.game.load.json("projectInfo", "package.json", true);
};

GameTitle.Boot.prototype.create = function()
{
  GameTitle.projectInfo = this.game.cache.getJSON("projectInfo");

  this.processSettings();

  GameTitle.platformSystem.show();

  this.state.start(GameTitle.Preloader.stateKey);
};

GameTitle.Boot.prototype.processSettings = function()
{
  GameTitle.retrieveLocalSettings();
};
