/** @constructor */
GameTitle =
{
  game: null,
  
  title: "Game Title",
  projectWebsite: "https://github.com/puzzud/gjweb",

  author: "Author",
  contributorList:
  [
    {
      firstName: "Person1",
      lastName: "Name1",
      contribution: "Code"
    },
    {
      firstName: "Person2",
      lastName: "Name2",
      contribution: "Code"
    },
    {
      firstName: "Person3",
      lastName: "Name3",
      contribution: "Art"
    },
    {
      firstName: "Person4",
      lastName: "Name4",
      contribution: "Music"
    }
  ],

  screenWidth: 960,
  screenHeight: 540,

  titleStyle: { font: "72px Arial", fill: "#ffffff" },

  buttonTextColor: 0xffffff,
  buttonTextOverColor: 0xffff00,
  buttonStyle: { font: "32px Arial", fill: "#ffffff" },

  activeButton: null,

  nodeWeb: null,
  window: null
};

GameTitle.run = function()
{
  this.game = new Phaser.Game( this.screenWidth, this.screenHeight,
                               Phaser.AUTO, "", this );

  this.game.state.add( GameTitle.Boot.stateKey, GameTitle.Boot );
  this.game.state.add( GameTitle.Preloader.stateKey, GameTitle.Preloader );
  this.game.state.add( GameTitle.MainMenu.stateKey, GameTitle.MainMenu );
  this.game.state.add( GameTitle.Game.stateKey, GameTitle.Game );
  this.game.state.add( GameTitle.About.stateKey, GameTitle.About );

  this.game.state.start( GameTitle.Boot.stateKey );

  this.setupNodeWeb();
};

GameTitle.setupNodeWeb = function()
{
  // Set up node webkit.
  if( typeof require !== "undefined" )
  {
    try
    {
      this.nodeWeb = require( "nw.gui" );
    }
    catch( exception )
    {
      this.nodeWeb = null;
      this.window = null;
      
      console.error( "Node Webkit is not present." );
      return;
    }

    if( this.nodeWeb !== null )
    {
      this.window = this.nodeWeb.Window.get();
      this.window.show();
    }
  }
};

GameTitle.contributorComparator = function( a, b )
{
  // Sort contributor list by last name, first name, and then contribution.
  var comparison = strcmp( a.lastName, b.lastName );
  if( comparison === 0 )
  {
    comparison = strcmp( a.firstName, b.firstName );
    if( comparison === 0 )
    {
      comparison = strcmp( a.contribution, b.contribution );
    }
  }

  return comparison;
};

GameTitle.setupButtonKeys = function( state )
{
  state.cursorKeys = state.input.keyboard.createCursorKeys();
  state.cursorKeys.up.onDown.add( GameTitle.upButtonDown, state );
  state.cursorKeys.down.onDown.add( GameTitle.downButtonDown, state );

  state.spaceBar = state.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
  state.spaceBar.onDown.add( GameTitle.activateButtonDown, state );
  state.enterKey = state.input.keyboard.addKey( Phaser.Keyboard.ENTER );
  state.enterKey.onDown.add( GameTitle.activateButtonDown, state );
};

GameTitle.cycleActiveButton = function( direction )
{
  var state = this.game.state.getCurrentState();

  var index = -1;

  // Cycle active button.
  if( GameTitle.activeButton === null )
  {
    index = 0;
  }
  else
  {
    index = state.buttonList.indexOf( GameTitle.activeButton );
    var currentIndex = index;

    index += direction;
    if( index >= state.buttonList.length )
    {
      index = 0;
    }
    else
    if( index < 0 )
    {
      index = state.buttonList.length - 1;
    }

    if( currentIndex === index )
    {
      // No need to change active buttons.
      return;
    }

    GameTitle.setActiveButton( null );
  }

  GameTitle.setActiveButton( state.buttonList[index] );
};

GameTitle.upButtonDown = function( button )
{
  GameTitle.cycleActiveButton( -1 );
};

GameTitle.downButtonDown = function( button )
{
  GameTitle.cycleActiveButton( 1 );
};

GameTitle.activateButtonDown = function( button )
{
  var activeButton = GameTitle.activeButton;
  if( activeButton === null )
  {
    // Default active button to start button for quick navigation.
    activeButton = this.buttonList[0];
    if( activeButton === undefined )
    {
      activeButton = null;
    }
    
    GameTitle.setActiveButton( activeButton );
  }
  
  // Directly call state's logic for this button.
  activeButton.activate.call( this.game.state.getCurrentState(), activeButton, null );
};

GameTitle.createTextButton = function( x, y, text, callback, callbackContext )
{
  var button = this.game.add.button( x, y, null, callback, callbackContext );
  button.anchor.setTo( 0.5, 0.5 );

  var label = new Phaser.Text( this.game, 0, 0, text, this.buttonStyle );
  label.anchor.setTo( 0.5, 0.5 );

  label.tint = this.buttonTextColor;

  button.addChild( label );
  //button.texture.baseTexture.skipRender = false;

  button.events.onInputOver.add( GameTitle.textButtonOnInputOver, callbackContext );
  button.events.onInputOut.add( GameTitle.textButtonOnInputOut, callbackContext );

  button.activate = callback;

  return button;
};

GameTitle.setActiveButton = function( button )
{
  if( GameTitle.activeButton !== null )
  {
    GameTitle.activeButton.children[0].tint = GameTitle.buttonTextColor;
    this.game.add.tween( GameTitle.activeButton.scale ).to( { x: 1.0, y: 1.0 }, 125, Phaser.Easing.Linear.None, true );
  }

  GameTitle.activeButton = button;

  if( button !== null )
  {
    button.children[0].tint = GameTitle.buttonTextOverColor;
    this.game.add.tween( button.scale ).to( { x: 1.125, y: 1.125 }, 125, Phaser.Easing.Linear.None, true );
  }
};

GameTitle.textButtonOnInputOver = function( button, pointer )
{
  GameTitle.setActiveButton( button );
};

GameTitle.textButtonOnInputOut = function( button, pointer )
{
  GameTitle.setActiveButton( null );
};

GameTitle.setupTitleAndText = function( state )
{
  // Title.
  var titleTextX = state.world.centerX;
  var titleTextY = ( state.world.height * ( 1 - 0.67 ) ) | 0;
  
  var titleText = state.add.text( titleTextX, titleTextY,
                                  GameTitle.title, GameTitle.titleStyle );

  titleText.anchor.setTo( 0.5 );

  // All text.
  var allTextGroup = state.game.add.group();
  allTextGroup.add( titleText );
  allTextGroup.add( state.buttonGroup );
  allTextGroup.alpha = 0.0;

  this.game.add.tween( allTextGroup ).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true );
};
