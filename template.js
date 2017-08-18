addScripts("Frameworks/",[
"Main.js",
"Keys.js",
"UI.js",
"Assets.js",
"Drawing.js",
"Mouse.js",
"Utils.js",
//"Physics.js"
]);
window.onload=init;
function addScripts(path,srcs){for(var p in srcs){var script=document.createElement("script");script.setAttribute("src",path+srcs[p]);document.head.appendChild(script);}}
function init(){
	registerFrameworks([
	{f:MainFramework,n:"M"},
	{f:KeysFramework,n:"K"},
	{f:UIFramework,n:"UI"},
	{f:UtilsFramework,n:"Utils"},
	// {f:PhysicsFramework,n:"Physics"},
	{f:AssetsFramework,n:"Ast"},
	{f:DrawingFramework,n:"Drw"},
	{f:MouseFramework,n:"Ms"},
	{f:TileRpgFramework,n:"Trpg"}
	]);
	assetsbit();
	document.body.style.margin="0px";
	M.createCanvas(window.innerWidth,window.innerHeight);
	var smaller=M.canvas.width,larger=M.canvas.height;
	if(smaller > M.canvas.height){smaller = M.canvas.height;larger = M.canvas.width;}
	var UU=new UI.DBox(0,0,M.canvas.width,M.canvas.height);
	//UU.camera.centerZero();
	UU.camera.zoomto(smaller/1000);
	// main dbox
	makeShortcut(new UI.DBox(00,00,1000,1000),"U");
	U.color="black";
	//U.camera.centerZero();
	UU.add(U);
	var lasttime=Date.now()/1000;
	var adt = 0;
	M.setLoop(function(){
		var before=Date.now()/1000;
		var dt=before-lasttime;
		lasttime=before;
		adt+=dt;
		var t = 1/66;
		while (adt >= t){
			adt-=t;
			UU.update(t);
			if (adt>5){
				adt-=5;
				UU.update(5);
			}
		}
		//UU.update(dt);
		var g=M.canvas.getContext("2d");
		g.clearRect(0,0,M.canvas.width,M.canvas.height);
		UU.render(g);
	});
	Ms.setcanvas(M.canvas);
	Ms.setupListeners({down:U.mousedown.bind(U),up:U.mouseup.bind(U),move:U.mousemove.bind(U)/*up:function(m){U.mouseup(m);},moved:function(){},rclick:function(m){U.mouserclick(m);}*/});
	var hub=new K.KeyHub();
	hub.down=U.keydown.bind(U);
	hub.up=U.keyup.bind(U);
	K.setupListeners(hub,document.body);
	M.startLoop();
}
addScripts("Libraries/",["seedrandom.js"]);
addScripts("",["TileRpg.js"]);
function assetsbit(){
	Ast.setPath("assets/");
	//{misc
	Ast.loadImage("hole","Hole.png");//}
	//{woodcutting
	Ast.loadImage("deadseedling","DeadSeedling.png");
	Ast.loadImage("seedling","Seedling.png");
	Ast.loadImage("sapling","Sapling.png");
	Ast.loadImage("tree","Tree.png");
	Ast.loadImage("stump","Stump.png");
	Ast.loadImage("log","Log.png");//}
	//{grounds
	Ast.loadImage("grass","Grass.png");
	Ast.loadImage("dirt","Dirt.png");
	Ast.loadImage("stone","Stone.png");//}
	//{smithing
	Ast.loadImage("furnace","Furnace.png");
	Ast.loadImage("anvil","Anvil.png");
	//{bars
	Ast.loadImage("bronzebar","BronzeBar.png");
	Ast.loadImage("ironbar","IronBar.png");//}
	//{armor//}
	//{weapons//}//}
	//{mining
	//{ores
	Ast.loadImage("tinore","TinOre.png");
	Ast.loadImage("copperore","CopperOre.png");
	Ast.loadImage("coalore","CoalOre.png");
	Ast.loadImage("ironore","IronOre.png");
	//Ast.loadImage("mithrilore","MithrilOre.png");
	//Ast.loadImage("adamantore","AdamantOre.png");
	//Ast.loadImage("runiteore","RuniteOre.png");
	Ast.loadImage("eterniumore","EterniumOre.png");//}
	//}
	//{portals
	Ast.loadImage("ladderdown","LadderDown.png");
	Ast.loadImage("ladderup","LadderUp.png");
	Ast.loadImage("bportal","BluePortal.png");
	Ast.loadImage("gportal","GreyPortal.png");//}
	//{walls
	Ast.loadImage("cwallu","CastleWallUp.png");
	Ast.loadImage("cwalll","CastleWallL.png");
	Ast.loadImage("cwallt","CastleWallT.png");
	Ast.loadImage("cwallx","CastleWallX.png");
	Ast.loadImage("cwallv","CastleWallVert.png");
	Ast.loadImage("cwallc","CastleWallCenter.png");//}
	//{fires
	Ast.loadImage("firebig","FireBig.png");
	Ast.loadImage("firesmall","FireSmall.png");//}
	//{farming
	Ast.loadImage("ploweddirt","PlowedDirt.png");//}
	//{player
	Ast.loadImage("playerN","PlayerN.png");
	Ast.loadImage("playerS","PlayerS.png");
	Ast.loadImage("playerE","PlayerE.png");
	Ast.loadImage("playerW","PlayerW.png");//}
	
	Ast.load();
}