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
	//{f:PhysicsFramework,n:"Physics"},
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
	M.setLoop(function(){
		var before=Date.now()/1000;
		var dt=before-lasttime;
		lasttime=before;
		UU.update(dt);
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
	Ast.loadImage("grass","Grass.png");
	Ast.loadImage("tree","Tree.png");
	Ast.loadImage("sapling","Sapling.png");
	Ast.loadImage("seedling","Seedling.png");
	Ast.loadImage("deadseedling","DeadSeedling.png");
	Ast.loadImage("stump","Stump.png");
	Ast.loadImage("hole","Hole.png");
	Ast.loadImage("log","Log.png");
	Ast.loadImage("ladderdown","LadderDown.png");
	Ast.loadImage("ladderup","LadderUp.png");
	Ast.loadImage("dirt","Dirt.png");
	Ast.loadImage("cwallu","CastleWallUp.png");
	Ast.loadImage("cwalll","CastleWallL.png");
	Ast.loadImage("cwallt","CastleWallT.png");
	Ast.loadImage("cwallx","CastleWallX.png");
	Ast.loadImage("cwallv","CastleWallVert.png");
	Ast.loadImage("cwallc","CastleWallCenter.png");
	Ast.loadImage("stone","Stone.png");
	Ast.loadImage("tinore","TinOre.png");
	Ast.loadImage("copperore","CopperOre.png");
	Ast.loadImage("blueore","BlueOre.png");
	Ast.loadImage("firebig","FireBig.png");
	Ast.loadImage("firesmall","FireSmall.png");
	Ast.loadImage("ploweddirt","PlowedDirt.png");
	Ast.loadImage("playerN","PlayerN.png");
	Ast.loadImage("playerS","PlayerS.png");
	Ast.loadImage("playerE","PlayerE.png");
	Ast.loadImage("playerW","PlayerW.png");
	Ast.load();
}