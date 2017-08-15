function TileRpgFramework(){
	this.frameworkName = "TileRpgFramework";
	var Trpg = this;
	this.WorldLoc = function(wx, wy, cx, cy, dim){
		this.wx = wx || 0;
		this.wy = wy || 0;
		this.cx = cx || 0;
		this.cy = cy || 0;
		this.x = function(){
			return 8*this.wx+this.cx;
		}
		this.y = function(){
			return 8*this.wy+this.cy;
		}
		this.dx = function(other){
			return 8*(other.wx-this.wx)+other.cx-this.cx;
		}
		this.dy = function(other){
			return 8*(other.wy-this.wy)+other.cy-this.cy;
		}
		this.shift = function(dx,dy){
			this.cx+=dx||0;
			this.cy+=dy||0;
			return this.legalize();
		}
		this.dim = dim || "surface";
		this.chunkdist = function(other){
			return Math.max(Math.abs(other.wx-this.wx),Math.abs(other.wy-this.wy));
		}
		this.dist = function(other, min){
			//return Math.round(Math.sqrt(Math.pow(8*(this.wx-other.wx)+this.cx-other.cx,2)+Math.pow(8*(this.wy-other.wy)+this.cy-other.cy,2)));
			if (!min)	return Math.max(Math.abs(this.dx(other)),Math.abs(this.dy(other)));
			else		return Math.min(Math.abs(8*(this.wx-other.wx)+this.cx-other.cx),Math.abs(8*(this.wy-other.wy)+this.cy-other.cy));
		}
		this.legalize = function(){
			while(this.cx < 0 || this.cx > 7){
				this.wx+=Math.sign(this.cx);
				this.cx-=8*Math.sign(this.cx);
			}
			while(this.cy < 0 || this.cy > 7){
				this.wy+=Math.sign(this.cy);
				this.cy-=8*Math.sign(this.cy);
			}
			return this;
		}
		this.load = function(wl){
			this.wx = wl.wx;
			this.wy = wl.wy;
			this.cx = wl.cx;
			this.cy = wl.cy;
			this.dim = wl.dim;
		}
		this.copy = function(){
			return new Trpg.WorldLoc(this.wx,this.wy,this.cx,this.cy,this.dim);
		}
		this.toStr = function(){
			return "("+this.wx+", "+this.wy+", "+this.cx+", "+this.cy+", "+this.dim+")";
		}
	}
	this.Populate = function(H){
		Trpg.Home = H
		H.empty();
		H.bcolor = "black";
		H.color = "grey";
		H.w = 1200;
		H.h = 800;
		H.container.stretchfit(H);
		H.camera.reset();
		
		function Title(){
			var t = new UI.DBox();
			t.add(new (function(){
				this.render = function(g){
					g.font = "100px Arial";
					g.fillStyle = "white";
					Drw.drawCText(g, "TileRPG", 600,200);
				}
			})());
			t.add(new UI.Button(500,300,200,50).sets({color:"green",text:"New Game",key:"n",onclick:function(){StartGame(true);}}));
			t.add(new UI.Button(500,400,200,50).sets({color:"blue",text:"Load Game",key:"l",onclick:function(){StartGame(false);}}));
			/*t.add(new UI.Button(500,500,200,50).sets({color:"red",text:"Instructions",onclick:function(){
				function instr(){
					var box = new UI.DBox(0,0,1200,800);
					box.color = "grey";
					box.add({render:function(g){
						g.font = "30px Arial";
						g.fillStyle = "white";
						Drw.drawBoxText(g,"Right click on a tile to open list of available actions.\n \n "+
						"Left clicking on a tile will default\n to the first action.\n \n "+
						"Clicking on an action in progress will cancel Trpg action.\n \n "+
						"Use W A S D to move.\n \n "+
						"Trees can be cut for logs. Logs can be burned with a tinderbox.\n \n "+
						"Dig up stumps to plant a new tree. Walking on seedling will kill it.\n \n "+
						"",600,150,600);
					}});
					box.add(new UI.Button(500,600,200,50).sets({color:"yellow",text:"Back",onclick:function(){t.remove(box);}}))
					return box;
				}
				t.add(new instr());
			}}));*/
			return t;
		}
		H.newtab("TitleMenu", Title());
		/*makeShortcut(H.get("Gameplay"),"Gameplay",true);
		var instrs = new UI.DBox();
		instrs.add(new (function(){
			this.render = function(g){
				g.font = "35px Arial";
				g.fillStyle = "white";
				Drw.drawBoxText(g,"Right click on a tile to open list of available actions.\n \n "+
				"Left clicking on a tile will default\n to the first action.\n \n "+
				"Clicking on an action in progress will cancel Trpg action.\n \n "+
				"Use W A S D to move.\n \n "+
				"",600,150,600);
			}
		})());
		instrs.add(new UI.Button(550,450,100,50).sets({text:"Back",color:"yellow",onclick:function(){U.prevtab()}}));
		//instrs.add(new Utils.KeyListener("down","Escape",function(){console.log("F$RG%H");}));
		H.newtab("Instructions",instrs);
		*/
		function Gameplay(){
			var g = new UI.DBox();
			var b,h,i;
			
			g.add(b = new UI.DBox(0,0,800,800),"Board");
			g.add(h = new UI.DBox(800,0,400,800),"Hud");
			g.add(i = new UI.DBox(0,300,400,500),"Hud.invent");
			i.color = "rgb(96,96,96)";
			h.color = h.bcolor = b.bcolor = "black";
			return g;
			/*H.add(new Utils.KeyListener("down","Escape",function(){H.prevtab()}));
			Board.add(new Utils.KeyListener("down","p",function(){H.settab("Instructions");}));
			H.settab("TitleMenu");
			H.add(new UI.Button(500,500,200,50).sets({color:"red",text:"Instructions",key:"i",onclick:function(){U.settab("Instructions")}}),"TitleMenu.");*/
		}
			//H.add(new Utils.KeyListener("down","l",function(){Trpg.invent.additem(new Trpg.Item("Log"))}));
			/*H.add(new Utils.KeyListener("down","u",function(){
				if (Trpg.board.player.loc.dim=="surface")
					Trpg.board.player.loc.dim = "underground1";
				else
					Trpg.board.player.loc.dim = "surface";
				Trpg.board.load(Trpg.board.player.loc,true);
			}));*/
		H.newtab("Gameplay",Gameplay());
		H.settab("TitleMenu")
		//Trpg.Board = H.get("Gameplay.Board");
		
		Trpg.SaveGame = function(){
			if (Trpg.world.getChanges()!="none")
				localStorage.setItem("TRPGSaveSlot"/*+this.slot*/,JSON.stringify(Trpg.world.getChanges()));
			return null;
		}
		function StartGame(newgame){
			new Trpg.World("zack is cool");
			H.add(Trpg.board,"Gameplay.Board.");
			H.add(Trpg.invent,"Gameplay.Hud.invent.")
			if (newgame)
			//Hud.invent.add(Trpg.invent);
				localStorage.removeItem("TRPGSaveSlot");//+this.slot);
			if (localStorage.getItem("TRPGSaveSlot"/*+this.slot*/)!=null)
				Trpg.world.loadChanges(JSON.parse(localStorage.getItem("TRPGSaveSlot"/*+this.slot*/)));
			
			window.onbeforeunload = Trpg.SaveGame;
			H.settab("Gameplay");
		}
	}
	/*this.ShittyBirdThing = function(){
		this.wl = Trpg.board.player.loc.copy();
		this.wl.wx+=Math.floor(Math.random()*2-1);
		this.wl.wy+=Math.floor(Math.random()*2-1);
		this.mx = this.my = 16;
		this.kill = function(){
			Board.container.get("killcounter").count++;
			this.container.remove(this);
		}
		this.update = function(d){
			//return;
			var dx = this.wl.dx(Trpg.board.player.loc);
			var dy = this.wl.dy(Trpg.board.player.loc);
			//console.log(dx+" "+dy);
			if (dx==0&&dy==0){
				Board.container.get("healthbar").health--;
				this.container.remove(this);
				return;
			}
			dx*=32;
			dx+=Trpg.board.player.mx-this.mx;
			dy*=32;
			dy+=Trpg.board.player.my-this.my;
			var angle = Math.atan2(dy,dx);
			this.mx+=170*d*Math.cos(angle);
			this.my+=170*d*Math.sin(angle);
			if (this.mx < 0 || this.mx >= 32){
				this.wl.cx+=Math.sign(dx);
				this.wl.legalize();
				this.mx-=32*Math.sign(dx);
			}
			if (this.my < 0 || this.my >= 32){
				this.wl.cy+=Math.sign(dy);
				this.wl.legalize();
				this.my-=32*Math.sign(dy);
			}
		}
		this.render = function(g){
			var dx = this.wl.dx(Trpg.board.player.loc)*-32+this.container.container.camera.x+this.mx-Trpg.board.player.mx;
			var dy = this.wl.dy(Trpg.board.player.loc)*-32+this.container.container.camera.y+this.my-Trpg.board.player.my;
			g.fillStyle = "brown";
			g.fillRect(dx-8,dy-8,16,16);
		}
	}*/
	this.World = function(seed){
		Trpg.imgs = {
			grass:Ast.i("grass"),
			tree:Ast.i("tree"),
			//appletree:Ast.i("appletree"),
			sapling:Ast.i("sapling"),
			seedling:Ast.i("seedling"),
			deadseedling:Ast.i("deadseedling"),
			stump:Ast.i("stump"),
			hole:Ast.i("hole"),
			ladderup:Ast.i("ladderup"),
			ladderdown:Ast.i("ladderdown"),
			dirt:Ast.i("dirt"),
			stone:Ast.i("stone"),
			tinore:Ast.i("tinore"),
			copperore:Ast.i("copperore"),
			blueore:Ast.i("blueore"),
			log:Ast.i("log"),
			firebig:Ast.i("firebig"),
			firesmall:Ast.i("firesmall"),
			ploweddirt:Ast.i("ploweddirt"),
			//applehole:Ast.i("applehole"),
			//rapplehole:Ast.i("rapplehole"),
			//bportal:Ast.i("bportal"),
			//gportal:Ast.i("gportal")
		}
		/*Board.container.add({health:20,maxhealth:20,render:function(g){
			g.fillStyle = "red";
			g.fillRect(Board.w+10,10,(Board.container.w-Board.w-20)*this.health/this.maxhealth,20);
		}},"healthbar");
		Board.container.add({count:0,render:function(g){
			g.fillStyle = "yellow";
			g.font = "25px Arial";
			g.fillText("Kill count: "+this.count,Board.w+10,60);
			//g.fillRect(Board.w+10,10,(Board.container.w-Board.w-20)*this.health/this.maxhealth,20);
		}},"killcounter");
		Board.container.add({apples:0,render:function(g){
			g.fillStyle = "red";
			g.font = "25px Arial";
			g.fillText("Apple basket: "+this.apples,Board.w+10,100);
			//g.fillRect(Board.w+10,10,(Board.container.w-Board.w-20)*this.health/this.maxhealth,20);
		}},"basket");*/
		//Trpg.Board.add(new UI.DBox(),"Birds");
		//Board.get("Birds").rl = 1;
		this.wseed = seed || Math.random();
		Trpg.world = this;
		Trpg.board = new Trpg.Board();
		Trpg.invent = new Trpg.Invent();
		Trpg.invent.additem(new Trpg.Item("Tinderbox"));
		Trpg.invent.additem(new Trpg.Item("Hoe"));
		Trpg.invent.additem(new Trpg.Item("Ladder"));
		/*Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));*/
		this.changed = [];
		this.changes = {};
		this.loadChanges = function(changes){
			//this.changed = 
			this.changed = changes.changed;
			this.changes = changes.changes;
			this.wseed = changes.seed;
			//console.log(changes);
			//var und;
			
			//taken out to avoid duplicate toolboxes
			//Trpg.board.init();
			
			
			//console.log(changes.ploc);
			//console.log(new Trpg.WorldLoc().copy());
			Trpg.board.player.loc.load(changes.ploc);
			Trpg.board.loaded = [];
			Trpg.board.load(Trpg.board.player.loc,true);
			//Trpg.invent = new Trpg.Invent();
			//console.log(changes.invent);
			Trpg.invent.loadsave(changes.invent);
		}
		this.getChanges = function(){
			Trpg.board.save();
			var d = Trpg.board.player.firstloc.dist(Trpg.board.player.loc);
			if (this.changes.length == 0 && d == 0)
				return "none";
			var loc = (Trpg.board.player.loc.copy());
			return {
				changed:this.changed,
				changes:this.changes,
				seed:this.wseed,
				ploc:loc,
				invent:Trpg.invent.getsave()
			}
		}
	}
	function Player(wl){
		return {
				img:{
					n:Ast.i("playerN"),
					s:Ast.i("playerS"),
					e:Ast.i("playerE"),
					w:Ast.i("playerW")
				},
				loc:wl||new Trpg.WorldLoc(0,0,3,3),
				mx:16,my:16,/*
				tool:"none",
				settool:function(toool,rmin,rmax){
					this.tools[toool] = {rmin:rmin,rmax:rmax,action:toool}
				},
				gettool:function(){
					return this.tools[this.tool];
				},
				inRange:function(wl){
					var d = this.loc.dist(wl);
					return this.gettool().rmin <= d && this.gettool().rmax >= d && this.tool != "none";
				},
				tools:{}*/
			};
	}
	function sameState(s1, s2){
		s1 = JSON.stringify(s1);
		s2 = JSON.stringify(s2);
		return s1===s2;
	}
	function copyObjTo(src,target){
		for (var p in src)
			if (src.hasOwnProperty(p))
				target[p] = src[p];
	}
	this.Invent = function(){
		this.spaces = [];
		this.selected = -1;
		this.using = -1;
		for (var i = 0; i < 35; i++)
			this.spaces.push("empty");
		this.getspace = function(m){
			var x = Math.floor((m.relx(Trpg.Home.get("Gameplay.Hud.invent"))-25)/Trpg.Home.get("Gameplay.Hud.invent").cumZoom()/64)
			var y = Math.floor((m.rely(Trpg.Home.get("Gameplay.Hud.invent"))-15)/Trpg.Home.get("Gameplay.Hud.invent").cumZoom()/64);
			if (x<0||x>4||y<0||y>6)
				return -1;
			return x+5*y;
		}
		this.getitem = function(s){
			if (s<0||s>34)	return -1;
			return this.spaces[s];
		}
		this.additem = function(item){
			if (item.stackable)
				for (var i = 0; i < 35; i++)
					if (this.spaces[i].type == item.type){
						this.spaces[i].amt++;
						return;
					}
			for (var i = 0; i < 35; i++)
				if (this.spaces[i]=="empty"){
					this.spaces[i] = item;
					item.space = i;
					return;
				}
		}
		this.getsave = function(){
			var save = [];
			for (var i = 0; i < 35; i++)
				if (this.spaces[i] == "empty")
					save.push("empty");
				else save.push({t:this.spaces[i].type,a:this.spaces[i].amt});
			return JSON.stringify(save);
		}
		this.loadsave = function(load){
			var save = JSON.parse(load);
		//	console.log(save);
			this.using = -1;
			for (var i = 0; i < 35; i++)
				if (save[i] !== "empty"){
					//console.log(save[i]);
					this.spaces[i] = new Trpg.Item(save[i].t);
					this.spaces[i].amt = save[i].a;
					this.spaces[i].space = i;
				}
		}
		this.getempty = function(){
			var empty = 0;
			for (var i = 0; i < 35; i++)
				if (this.spaces[i] == "empty")
					empty++;
			return empty;
		}
		this.hasitem = function(item,amt){
			amt = amt || 1;
			for (var i = 0; i < 35; i++)
				if (this.spaces[i].type == item)
					amt-=this.spaces[i].amt;
			return amt <= 0;
		}
		this.dropitem = function(item){
			Trpg.board.ground.dropitem(item,Trpg.board.player.loc);
			this.spaces[item.space] = "empty";
		}
		this.removeitem = function(item){
			if (typeof item == "string"){
				for (var i = 0; i < 35; i++)
					if (this.spaces[i] !== "empty" && this.spaces[i].type == item)
						this.spaces[i].amt--;
			}
			else 	this.spaces[item.space].amt--;
			for (var i = 0; i < 35; i++)
				if (this.spaces[i] !== "empty" && this.spaces[i].amt < 1)
					this.spaces[i] = "empty";
		}
		this.render = function(g){
			g.lineWidth = 2;
			for (var i = 0; i < 35; i++){
				g.save();
				if (this.using!=-1 && this.using.space == i)
					g.strokeStyle = "white";
				g.translate(64*Math.floor(i%5),64*Math.floor(i/5),62,62);
				g.strokeRect(40,20,62,62);//+64*Math.floor(i%5),20+64*Math.floor(i/5),62,62);
				g.strokeStyle = "black";
				g.scale(2,2);
				if (this.spaces[i] !== "empty")
					this.spaces[i].render(g,19,10);//+32*Math.floor(i%5),10+32*Math.floor(i/5));
				g.translate(20,10);
				if (Trpg.Home.get("Gameplay").has("currentaction")
					&&!Trpg.Home.get("Gameplay.currentaction").board
					&&Trpg.Home.get("Gameplay.currentaction").space==i)
					Trpg.Home.get("Gameplay.currentaction").renderp(g);
				g.scale(1/2,1/2);
				g.restore();
			}
		}
	}
	this.Item = function(type){
		function Default(){
			this.type = "default";
			this.board = false;
			this.stackable = true;
			this.amt = 1;
			this.useon = function(on){
				Trpg.invent.using = -1;
			}
			this.doaction = function(action){	}
			this.useon = function(on){	}
			this.getActions = function(){	return this.actions;	}
			this.hasAction = function(action){	return this.getActions().indexOf(action)!=-1;}
			this.render = function(g,x,y){}
		}
		function Log(){
			this.type = "Log";
			var that = this;
			this.stackable = false;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
				switch (on.type){
					case "Tinderbox":
						this.doaction("light");
						break;
					case "FireSmall":
						//var timer = new Utils.Timer(1).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("FireBig"),on.wl);
							Trpg.invent.removeitem(that);
						// }).setKilloncomp(true);
						//timer.board = false;
						//timer.space = this.space;
						//Trpg.Home.add(timer,"Gameplay.currentaction");
				}
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "light":
						if (!Trpg.board.getTile(Trpg.board.player.loc).getTrait("burnable"))
							return;
						var timer = new Utils.Timer(1.3).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("FireBig"),Trpg.board.player.loc);
							Trpg.invent.removeitem(that);
						}).setKilloncomp(true);
						timer.board = false;
						timer.space = this.space;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						//Trpg.board.setTile(Hole.call(new Default()),this.wl);
						break;
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				
				g.drawImage(Trpg.imgs.log,x,y);
				g.fillStyle = "yellow";
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		function Seed(){
			this.type = "Seed";
			var that = this;
			this.stackable = true;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
				switch (on.type){
					case "Hole":
						on.doaction("plant");
						Trpg.invent.removeitem(this);
						break;
					//case "FireSmall":
						//var timer = new Utils.Timer(1).start().setAuto(true,function(){
							//Trpg.board.setTile(new Trpg.Tile("FireBig"),on.wl);
							//Trpg.invent.removeitem(that);
						// }).setKilloncomp(true);
						//timer.board = false;
						//timer.space = this.space;
						//Trpg.Home.add(timer,"Gameplay.currentaction");
				}
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				g.fillStyle = "yellow";
				g.fillText("Seed",x+5,y+20);
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		function Tin(){
			this.type = "Tin";
			this.stackable = false;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				g.drawImage(Trpg.imgs.tinore,x,y);
				g.fillStyle = "yellow";
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		function Copper(){
			this.type = "Copper";
			this.stackable = false;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				g.drawImage(Trpg.imgs.copperore,x,y);
				g.fillStyle = "yellow";
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		function Ladder(){
			this.type = "Ladder";
			this.stackable = false;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				g.drawImage(Trpg.imgs.ladderup,x,y);
				g.fillStyle = "yellow";
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		function Tinderbox(){
			this.type = "Tinderbox";
			this.stackable = false;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
				switch (on.type){
					case "Log":
						on.doaction("light");
						break;
				}
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				g.fillStyle = "yellow";
				g.fillText("Tind",x+5,y+20);
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		function Hoe(){
			this.type = "Hoe";
			this.stackable = false;
			this.actions = ["use","drop"];
			this.useon = function(on){
				Trpg.invent.using = -1;
				switch (on.type){
					case "Grass":
						on.doaction("plow");
						break;
				}
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.render = function(g,x,y){
				g.fillStyle = "yellow";
				g.fillText("Hoe",x+5,y+20);
				if (this.stackable)
					g.fillText(this.amt,x+5,y+10);
			}
			return this;
		}
		var items = {
			Log:Log,
			Tinderbox:Tinderbox,
			Hoe:Hoe,
			Seed:Seed,
			Tin:Tin,
			Copper:Copper,
			Ladder:Ladder
		}
		return items[type].apply(new Default());
	}
	function ToolBox(){
		var box = new UI.DBox();
		box.cropped = true;
		box.hidden = true;
		box.curtool = "none";
		box.tools = [];
		box.color = "grey";
		box.bcolor = "darkgrey";
		box.actingwl = -1;
		box.action = {
			timer:-1,
			loc:"none"
		}
		/*
		box.addTool = function(action, rmin, rmax){
			var pos = -1;
			for (var i = 0; i < box.tools.length; i++)
				if (box.tools[i].action == action)
					pos = i;
			if (pos == -1)box.tools.push({action:action,rmin:rmin,rmax:rmax});
			else box.tools.splice(pos,1,{action:action,rmin:rmin,rmax:rmax});
			box.reorg();
		}
		box.getTool = function(){
			for (var i = 0; i < this.tools.length; i++)
				if (this.tools[i].action == this.curtool)
					return this.tools[i];
		}
		box.inRange = function(d){
			var t = this.getTool();
			return d >= t.rmin && d <= t.rmax;
		}/*
		box.reorg = function(){
			var s = Math.ceil(Math.sqrt(box.tools.length));
			box.empty();
			box.w = s*50;
			box.h = Math.ceil(box.tools.length/s)*50;
			for (var i = 0; i < box.tools.length; i++){
				var btn = new UI.Button(i%s*50,Math.floor(i/s)*50,50,50);
				btn.toolname = box.tools[i].action;
				btn.inrender = function(g){
					g.fillStyle = "darkgrey";
					if (box.curtool == this.toolname)
						g.fillStyle = "black";
					g.font = "15px Arial";
					var a = this.toolname;
					Drw.drawCText(g,a.charAt(0).toUpperCase()+a.substring(1),this.w/2,this.h/2);
				}
				btn.onclick = function(){
					if (box.curtool == this.toolname)
						 box.curtool = "none";
					else box.curtool = this.toolname;
					box.invisible = true;
				}
				box.add(btn);
			}
		} */
		box.moveToMouse = function(m){
			box.x = m.relx(box.container)/box.container.cumZoom()-20;
			box.y = m.rely(box.container)/box.container.cumZoom()-15;
		}
		//box.open = function(wl){
			//console.log(tile.getActions());
		//			box.actingwl = wl.copy();
		//	var tile = Trpg.board.getTile(wl);
		box.open = function(tile){
			var actions = tile.getActions();
			if (Trpg.invent.using != -1)
				actions = [Trpg.invent.using.type+" -> "+tile.type];
			//var wl = tile.wl;
			//if (!isinv)
			//	box.actingwl = wl.copy();
			var s = actions.length;//Math.ceil(Math.sqrt(actions.length));
			box.empty();
			box.h = s*35;
			box.w = 105;//Math.ceil(actions.length/s)*50;
		//	console.log(box.w+" "+box.h);
			for (var i = 0; i < actions.length; i++){
				var btn = new UI.Button(0,i*35,105,35);//Math.floor(i/s)*75,i%s*25,75,25);
				btn.toolname = actions[i];
				btn.inrender = function(g){
					//g.fillStyle = "darkgrey";
					//if (box.curtool == this.toolname)
						g.fillStyle = "black";
					g.font = "15px Arial";
					var a = this.toolname;
					Drw.drawCText(g,a.charAt(0).toUpperCase()+a.substring(1),this.w/2,this.h/2);
				}
				btn.onclick = function(){
					if (this.toolname.indexOf("->")!=-1)
						Trpg.invent.using.useon(tile);
					else if (this.toolname != "")
						tile.doaction(this.toolname);
					box.empty();
					box.hidden = true;
					return true;
				}
				box.add(btn);
			}
			if (exists(tile.wl) && Trpg.board.ground.hasitems(tile.wl)){
				var items = Trpg.board.ground.getitems(tile.wl);
				//console.log(items);
				if (items.length > 1){
					var btn = new UI.Button(0,box.h,105,35);
					box.h+=35;
					btn.color = "orange";
					btn.text = "Take All";
					btn.onclick = function(){
						var es = Trpg.invent.getempty();
						var l = items.length;
						for (var i = 0; i < es && i < l; i++)
							Trpg.invent.additem(items.splice(0,1)[0].item);
						box.empty();
						box.hidden = true;
						return true;
					}
					box.add(btn);
				}
				for (var i = 0; i < items.length; i++){
					var btn = new UI.Button(0,box.h+35*i,105,35);
					btn.color = "orange";
					btn.text = items[i].item.type;
					btn.i = i;
					btn.onclick = function(){
						Trpg.invent.additem(items.splice(this.i,1)[0].item);
						box.empty();
						box.hidden = true;
						return true;
					}
					box.add(btn);
				}
				box.h+=35*items.length;
			}
			box.hidden = false;
		}
		box.clicked = function(tile){
			//console.log(box.actingwl);
			//if (box.container.has("actiondelay")//&&exists(box.actingwl)
			//	&&(exists(box.actingwl)
			//&&box.actingwl !== -1
			//&&wl.dist(box.actingwl)==0){
			//	box.container.remove("actiondelay");
			//	box.actingwl = -1;
			//	return;
			// }
			//var tile = Trpg.board.getTile(wl);
			if (Trpg.invent.using != -1)
				return Trpg.invent.using.useon(tile);
			//console.log("not using");
			if (tile.getActions()[0] == "")
				return;
			if (K.Keys.shift.down && tile.getActions().indexOf("drop")!=-1)
				return tile.doaction("drop");
			//console.log("not using2");
			if (Trpg.Home.get("Gameplay").has("currentaction")
					&&(Trpg.Home.get("Gameplay.currentaction").board==tile.board)
					&&(		(Trpg.Home.get("Gameplay.currentaction").board
							&&Trpg.Home.get("Gameplay.currentaction").wl.dist(tile.wl)==0)
						||	(!Trpg.Home.get("Gameplay.currentaction").board
							&&Trpg.Home.get("Gameplay.currentaction").space==tile.space)))
							return Trpg.Home.get("Gameplay").remove("currentaction");
			//console.log("not using3");
			tile.doaction();
			return;
			
			
			box.actingwl = wl.copy();
			box.empty();
			box.hidden = true;
			var timer = new Utils.Timer(tile.getDelay()*.2*(2+wl.dist(Trpg.board.player.loc))).start().setAuto(true, 
				function(){tile.doaction();box.actingwl = -1}).setKilloncomp(true);
			//if (box.container.has("actiondelay"))
			//	box.container.remove("actiondelay");
			box.container.add(timer,"actiondelay");
		}
		box.init = function(){
			/*this.container.add(new Utils.MouseListener("down",function(e,m){
				if (e.button == 2 && box.invisible){
					box.invisible = false;
					box.x = m.relx(box.container)/box.container.cumZoom()-25;//-box.w/2;
					box.y = m.rely(box.container)/box.container.cumZoom()-25;//-box.h/2;
				}
			}));*/
			this.container.add(new Utils.MouseListener("move",function(e,m){
			//	var bbox = new UI.DBox(box.x-box.w/8,box.y-box.h/8,box.w*(1+1/4),box.h*(1+1/4));
				//box.container.add(bbox);
				if (!box.mouseonbox(m)){//bbox
				box.hidden = true;}
				//box.container.remove(bbox);
			}));
		}
		Trpg.Home.get("Gameplay").add(new (function(){
			this.mousedown = function(e,m){
				if (!Trpg.Home.mouseonbox(m))	return;
				if (Trpg.Home.get("Gameplay.Board").mouseonbox(m)){
					box.moveToMouse(m);
					if (e.button == 2){
						box.open(Trpg.board.getTile(Trpg.board.aim.copy()));
						return;
					}
					if (box.hidden)
					//console.log(Trpg.board.aim.copy());
					box.clicked(Trpg.board.getTile(Trpg.board.aim.copy()));
				}
				else if (Trpg.Home.get("Gameplay.Hud").mouseonbox(m)){
					box.moveToMouse(m);
					if (e.button == 2){
						var s = Trpg.invent.getspace(m);
						if (s!==-1&&Trpg.invent.getitem(s)!=="empty")
							box.open(Trpg.invent.getitem(s));
						return;
					}
					if (box.hidden){
						var s = Trpg.invent.getspace(m);
						if (s!==-1&&Trpg.invent.getitem(s)!=="empty")
							box.clicked(Trpg.invent.getitem(s));
					}
					//console.log(Trpg.board.aim.copy());
					//box.clicked(Trpg.board.getTile(Trpg.board.aim.copy()));
				}
			}
		})(),"toolclicker");
		/*
		box.addTool("chop",1,1);
		box.addTool("dig",0,1);
		box.addTool("plant",1,1);
		box.addTool("kill",1,3);
		box.addTool("burn1",0,1);
		box.addTool("burn2",0,1);
		box.addTool("burn3",0,1);
		box.addTool("burn4",0,1);
		box.addTool("burn5",0,1);
		box.addTool("burn6",0,1);*/
		//console.log("tool made");
		return box;
	}
	this.Board = function(){
		this.load = function(wl,force){
			if (!exists(wl)) wl = new Trpg.WorldLoc(0,0,3,3);
			this.rcenter = new Trpg.WorldLoc(wl.wx,wl.wy,3,3,wl.dim);
			this.lcenter = new Trpg.WorldLoc(wl.wx,wl.wy,4,4,wl.dim);
			var ccenter = new Trpg.WorldLoc(wl.wx,wl.wy,0,0,wl.dim);
			if (force)
				this.loaded = [];
			for (var i = -1; i <= 1; i++)
				for (var j = -1; j <= 1; j++){
					var alreadyin = false;
					for (var k = 0; k < this.loaded.length; k++)
						if (this.loaded[k].wl.dist(new Trpg.WorldLoc(wl.wx+i,wl.wy+j,0,0,wl.dim)) == 0)
							alreadyin = true;
					if (alreadyin)
						continue;
					this.loaded.push(new Trpg.Chunk(wl.wx+i,wl.wy+j,wl.dim).generate());
				}
					for (var k = 0; k < this.loaded.length; k++)
						if (this.loaded[k].wl.dist(ccenter) > 8){
							var changes = this.loaded[k].getChanges();
							if (changes!="none"){
								Trpg.world.changes[this.loaded[k].code] = changes;
							}
							this.loaded.splice(k,1);
							k--;
						}
		}
		this.save = function(){
			for (var k = 0; k < this.loaded.length; k++){
				var changes = this.loaded[k].getChanges();
				if (changes!="none")
					Trpg.world.changes[this.loaded[k].code] = changes;
			}
		}
		this.ground = new (function(){
			function grounditem(item){
				return {
					item:item,
					x:Math.random()*32,
					y:Math.random()*32
				}
			}
			this.getitems = function(wl){
				return this.items[wl.toStr()];
			}
			this.items = {}
			this.hasitems = function(wl){
				return this.items.hasOwnProperty(wl.toStr()) && this.items[wl.toStr()].length > 0;
			}
			this.render = function(g,wl){
				var l = this.items[wl.toStr()];
				g.save();
				g.scale(1/2,1/2);
				for (var i = 0; i < l.length; i++)
					l[i].item.render(g,l[i].x,l[i].y);
				g.restore();
			}
			this.dropitem = function(item, wl){
				var i = grounditem(item);
				if (!this.hasitems(wl))
					this.items[wl.toStr()] = [i];
				else 
					this.items[wl.toStr()].push(i);
				var list = this.items[wl.toStr()];
				Trpg.board.container.add(new Utils.Timer(30).start().setAuto(true,function(){
							list.splice(list.indexOf(i),1);
						}).setKilloncomp(true));
			}
		})()
		this.getTile = function(wl){
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.chunkdist(wl)==0)
					return this.loaded[i].getTile(wl);
		}
		this.setTile = function(tile, wl){
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.chunkdist(wl)==0)
					this.loaded[i].setTile(tile,wl.copy());
		}
		this.init = function(){
			//console.log("initing");
			this.loaded = [];
			this.container.container.add(Trpg.toolbox = new ToolBox());
			this.player = new Player();
			//this.player.loc.dim = "underground1";
			this.load(this.player.loc,true);
			//this.setTile(new Trpg.Tile("StoneFloor").setWl(this.player.loc),this.player.loc);
			while (!this.getTile(this.player.loc).getTrait("walkable")){
				this.player.loc.cx+=Math.floor(Math.random()*2-1);
				this.player.loc.cy+=Math.floor(Math.random()*2-1);
				this.player.loc.legalize();
			//	console.log(this.player.loc.toStr());
			//console.log(this.getTile(this.player.loc).getTrait("walkable"));
			}
			this.player.firstloc = this.player.loc.copy();
			//console.log(this.getTile(this.player.loc).getTrait("walkable"));
			//this.load(this.player.loc);
			
			this.dx = 0;
			this.dy = 0;
			//this.center.container = this.container;
			this.container.camera.zoomto(1/15/32*this.container.w);
			this.container.add(new UI.Follow(this.container.camera,this.player.loc,0,0,32));
			this.viewsize = 9;
		}
		//this.keydown = function(k){
			//if (k.name != "esc")	return;
			//console.log(Trpg.world.getChanges());
		//	return false;
		// }
		/*this.mousedown = function(e,m){
			if (this.aim == -1 || (e.button != 0 && e.button !=2))
				return;
			Trpg.toolbox.moveToMouse(m);
			if (e.button == 2){
				Trpg.toolbox.open((this.aim.copy()));
				return;
			}
			Trpg.toolbox.clicked(this.aim.copy());
		} */
			/*
			
			if (Trpg.toolbox.getTool().action == "kill")
				for (var i = 0; i < Board.get("Birds").getq().length; i++){
					var bird = Board.get("Birds").getq()[i];
					if (bird.wl.dist(this.aim) == 0){
						bird.kill();
						i--;
					}
				}
			else this.getTile(this.aim).doaction(Trpg.toolbox.getTool().action);
		}/*
		this.keydown = function(k){
			//this.dx = 0;
			//this.dy = 0;
			switch (k.name){
				case "W":case "A":case "S":case "D":
					if (this.d.indexOf(k.name)==-1)
						this.d.splice(0,0,k.name);
						//this.d = k.name+this.d;
					break;
				case "Q":
					
					break;
				/*case "W":	this.dy = -1;	break;
				case "A":	this.dx = -1;	break;
				case "S":	this.dy = 1;	break;
				case "D":	this.dx = 1;	break;*
			}
		}
		this.keyup = function(k){
			switch (k.name){
				case "W":case "A":case "S":case "D":
					if (this.d.indexOf(k.name)!=-1)
						this.d.splice(this.d.indexOf(k.name),1);
					break;
			}
		}*/
		this.mousemove = function(e,m){
			var fakecam = {x:this.container.camera.x,y:this.container.camera.y,container:this.container};
			//var fakecam = {x:this.center.x()+this.center.mx,y:this.center.y+this.center.my,container:this.container};
			//g.rotate(Ms.rela(fakecam));
			
			var x = m.relx(fakecam)/this.container.cumZoom()+this.player.mx-16;
			var y = m.rely(fakecam)/this.container.cumZoom()+this.player.my-16;
			/*if (x > 64)		x = 64;
			if (x < -64)	x = -64;
			if (y > 64)		y = 64;
			if (y < -64)	y = -64;
			*///if (Ms.reld(fakecam) >= 64*this.container.cumZoom()) {
			//	x = 64*Math.cos(Ms.rela(fakecam));
			//	y = 64*Math.sin(Ms.rela(fakecam));
			// }
			this.aim = this.player.loc.copy();
			this.aim.cx+=Math.round(x/32);
			this.aim.cy+=Math.round(y/32);
			this.aim.legalize();
			
			if (//Trpg.toolbox.curtool == "none" || 
				!this.container.mouseonbox(m))//  ||
				//this.aim.dist(this.player.loc) > 2)
				//!Trpg.toolbox.inRange(this.aim.dist(this.player.loc)))
					this.aim = -1;
					return;
			/*
			if (Trpg.toolbox.curtool == "none" || 
				!this.container.mouseonbox(Ms.getMouse()) ){// ||
				//!Trpg.toolbox.inRange(this.aim.dist(this.player.loc)))
				this.aim = -1;return;}
			var temp = this.player.loc.copy();
			var valid = false;
			var a = Math.atan2(y,x);
			for (var i = 0; i < Math.sqrt(x*x+y*y); i++){
				var valid = Trpg.toolbox.inRange(temp.dist(this.player.loc));
				if (valid)	this.aim = temp.copy();
				temp.cx+=Math.round(i*Math.cos(a));
				temp.cy+=Math.round(i*Math.sin(a));
				temp.legalize();
				if (valid && !Trpg.toolbox.inRange(temp.dist(this.player.loc)))
					break;
				
			}
			return;
			
			this.aim = this.player.loc.copy();
			this.aim.cx+=Math.round(x/32);
			this.aim.cy+=Math.round(y/32);
			this.aim.legalize();
			
			if (Trpg.toolbox.curtool == "none" || 
				!this.container.mouseonbox(Ms.getMouse()) )// ||
				//!Trpg.toolbox.inRange(this.aim.dist(this.player.loc)))
					this.aim = -1;
			if (this.aim!=-1 && !Trpg.toolbox.inRange(this.aim.dist(this.player.loc))){
				var d = this.aim.dist(this.player.loc);
				var ddist = (function(){
					for (var i = 0; i < d; i++)
						if (Trpg.toolbox.inRange(d-i))
							return -1;
						else if (Trpg.toolbox.inRange(d+i))
							return 1;
						return 0;
				})();
				if (ddist == 0){
					this.aim = -1;
					return;
				}
				var start = this.aim.copy();
				var a = Math.atan2(this.player.loc.dy(this.aim),this.player.loc.dx(this.aim));
				var dd = Math.sqrt(32*32*(this.player.loc.dy(this.aim)*this.player.loc.dy(this.aim)+this.player.loc.dx(this.aim)*this.player.loc.dx(this.aim)));
				
				do {
					//start.cx+=Math.cos(a)*ddist;
					//start.cy+=Math.sin(a)*ddist;
					
					//start.legalize();
					
					this.aim.cx+=Math.floor(Math.floor(dd*Math.cos(a))%32/32)*ddist;
					this.aim.cy+=Math.floor(Math.floor(dd*Math.sin(a))%32/32)*ddist;
					this.aim.legalize();
					alert(this.aim.toStr()+" "+this.player.loc.dist(this.aim));
					dd--;
					
					//var x = this.player.loc.dx(this.aim);
					//var y = this.player.loc.dy(this.aim);
					
					//if (Math.abs(x) > Math.abs(y)){
					//	this.aim.cx+=ddist;
					// }
					
					
					//Math.sign(this.player.loc.dx(this.aim))*ddist;
					//start.cy+=Math.sign(this.player.loc.dy(this.aim))*ddist;
					//this.aim.cx = Math.round(start.cx);//+=Math.sign(this.player.loc.dx(this.aim))*ddist;
					//this.aim.cy = Math.round(start.cy);//+=Math.sign(this.player.loc.dy(this.aim))*ddist;
					//b--;
				} while (!Trpg.toolbox.inRange(this.aim.dist(this.player.loc))&&dd>0);
				//if (b <= 0)
				//	this.aim = -1;
			} */
		}
		this.update = function(dlt){
			//this.cd.update(dlt);
			for (var i = 0; i < this.loaded.length; i++)
				this.loaded[i].update(dlt);
			this.dx = 0;
			this.dy = 0;
			
			if (K.Keys.W.down)	this.dy--;
			if (K.Keys.A.down)	this.dx--;
			if (K.Keys.S.down)	this.dy++;
			if (K.Keys.D.down)	this.dx++;
			//if (this.d = [])
			//	return;
			//var dr = this.d[0];//this.mq;
			//if ("WASD".indexOf(this.mq)!=-1&&this.mq!="")
			//	dr = this.mq;
			//if (this.d.length == 0 && "WASD".indexOf(this.mq)!=-1)
			//	dr = this.mq;
			//if (this.mq!="")
			//	dr = this.mq;
			//else if (!this.cd.ready()&&this.mq =="" && this.d.length>0){
			//	this.mq = dr;
			// }
			//if (this.mq != "")
				//dr = this.mq;
			//this.mq = "";
			//if ("WASD".indexOf(dr)==-1 && this.d!=[])
			//	dr = this.d[0];
		//if (this.cd.ready())
		///	dr = this.mq;
			//if ("WASD".indexOf(this.mq)!=-1 && this.mq != "")
			//	dr = this.mq;
				
				/*
			switch (dr){
				case "W":	this.dy = -1;	break;
				case "A":	this.dx = -1;	break;
				case "S":	this.dy = 1;	break;
				case "D":	this.dx = 1;	break;
			} */
			var speed = 70*dlt;
			//if (K.Keys.space.down)
				speed*=2;
			if (this.dx!=0&&this.dy!=0)
				speed/=Math.sqrt(2);
			this.player.mx+=this.dx*speed;
			this.player.my+=this.dy*speed;
			var loc = this.player.loc.copy();
			if (this.player.mx < 0 || this.player.mx >= 32){
				loc.cx+=this.dx;
				//this.player.loc.cx+=this.dx;
				loc.legalize();
				//this.player.loc.legalize();
				if (!this.getTile(loc).getTrait("walkable")){
				//if (!this.getTile(this.player.loc).getTrait("walkable")){
					loc.cx-=this.dx;
					//this.player.loc.cx-=this.dx;
					this.player.mx-=this.dx*speed;
				} else {
					this.player.mx-=32*this.dx;
				}
			}
			if (this.player.my < 0 || this.player.my >= 32){
				loc.cy+=this.dy;
				//this.player.loc.cy+=this.dy;
				loc.legalize();
				//this.player.loc.legalize();
				if (!this.getTile(loc).getTrait("walkable")){
				//if (!this.getTile(this.player.loc).getTrait("walkable")){
					loc.cy-=this.dy;
					//this.player.loc.cy-=this.dy;
					this.player.my-=this.dy*speed;
				} else {
					this.player.my-=32*this.dy;
				}
			}
			loc.legalize();
			if (this.player.loc.dist(loc)!=0){
				this.getTile(loc).doaction("walkon");
				if (Trpg.Home.get("Gameplay").has("currentaction"))
					Trpg.Home.get("Gameplay").remove("currentaction");
			}
			this.player.loc.load(loc);
			//this.player.loc.wx = loc.wx;
			//this.player.loc.wy = loc.wy;
			//this.player.loc.cx = loc.cx;
			//this.player.loc.cy = loc.cy;
			if (this.rcenter.dist(this.player.loc)>4||this.lcenter.dist(this.player.loc)>4)
				this.load(this.player.loc);
			this.mousemove("blah",Ms.getMouse());
			//while(!this.player.inRange(this.aim)){
				
			// }
				
		//	if (("WASD".indexOf(this.mq)==-1 || this.mq == "") && this.dx==this.mx&&this.dy==this.my)
			//	this.mq = dr;
			
		//	if (!this.cd.ready())
			//	if (this.dx == this.mx && this.dy == this.my)
			//		;//ignore it
			//	else this.mq = dr;
			/*
			if (this.dx != 0 || this.dy != 0)
				if (this.cd.ready()){		
					this.center.cy+=this.dy;
					this.center.cx+=this.dx;
					this.mx = this.dx;
					this.my = this.dy;
					this.center.legalize();
					this.cd.consume();
					this.mq = "";
				} //else if (this.d.length > 1)
					//this.mq = this.d[1];
				*/
		}
		this.render = function(g){
			//g.translate(-32*this.center.cx,-32*this.center.cy);
			//if (!this.cd.ready())
				g.save();
				g.translate(-this.player.mx,-this.player.my);
				//g.translate(32*this.mx*(1-this.cd.progress()),32*this.my*(1-this.cd.progress()));
			for (var i = 0; i < this.loaded.length; i++){
				g.save();
				this.loaded[i].render(g);
				g.restore();
			}
			g.restore();
				//g.fillStyle = "white";
				//g.fillRect(this.container.camera.x-2,this.container.camera.y-2,4,4);
				g.drawImage(this.player.img.s,this.container.camera.x-16,this.container.camera.y-16);
				g.save();
				g.fillStyle = "black";
				g.font = "10px Arial";
				g.globalAlpha = .25;
				g.fillText(this.player.loc.toStr(),this.container.getbounds().l+2,this.container.getbounds().u+10);
				//g.translate(this.container.camera.x,this.container.camera.y-6);//dont draw aimer
				//else g.fillRect(0,-2,Math.sqrt(x*x+y*y),4);
				//else if (Ms.reld(fakecam) < 64*this.container.cumZoom())
				//	 g.fillRect(0,-2,Ms.reld(fakecam)/this.container.cumZoom(),4);
				//else //if (Ms.reld(fakecam) < 2*64*this.container.cumZoom())
				//	g.fillRect(0,-2,64,4);
				g.restore();
				//g.fillText(this.d,100,100);
			//	g.fillText(this.mq,100,150);
			//	g.fillStyle = "black";
			
		}
	}
	this.Tile = function(type,args){
		function Default(){
			this.type = "default";
			this.board = true;
			this.state = {};
			this.traits = {};
			this.getTrait = function(trait){
				if (this.traits.hasOwnProperty(trait))
					return this.traits[trait];
				return false
			}
			this.setState = function(loadobj,state){
				//	this = object to save state into
				//	loadobj = object to load state into
				return this; // save object
			}
			this.setWl = function(wl){	this.wl = wl;	return this;}
			this.actions = [""];
			this.getActions = function(){	return this.actions;	}
			this.hasAction = function(action){	return this.getActions().indexOf(action)!=-1;}
			this.getDelay = function(action){	return 0;	}
			this.doaction = function(action){}
			this.loadJSON = function(json){
				
			}
			this.loadChanges = function(changes){return this;}
			this.getChanges = function(){	return "none";	}
			this.update = function(d){}
			this.render = function(g){}
		}
		function Grass(){
			this.type = "Grass";
			this.actions = ["dig"];
			this.traits.burnable = true;
			this.traits.walkable = true;
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "dig":
						var timer = new Utils.Timer(.7).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Hole"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
					case "plow":
						var timer = new Utils.Timer(1.2).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("PlowedDirt"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
			}
			return this;
		}
		function PlowedDirt(){
			var that = this;
			this.type = "PlowedDirt";
			this.actions = ["dig"];
			this.traits.walkable = true;
			this.growtimer = new Utils.Timer(5).setAuto(true,function(){
				Trpg.board.setTile(new Trpg.Tile("Grass"),that.wl);
			}).start();
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "dig":
						var timer = new Utils.Timer(.7).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Hole"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			this.update = function(d){
				this.growtimer.update(d);
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.ploweddirt,0,0);
				this.growtimer.renderp(g);
			}
			return this;
		}
		function Hole(){
			this.type = "Hole";
			this.traits.burnable = true;
			this.traits.walkable = true;
			this.actions = ["fill","excavate"];
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "fill":
						var timer = new Utils.Timer(1).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Grass"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
					case "excavate":
						if (!Trpg.invent.hasitem("Ladder")) break;
						Trpg.invent.removeitem("Ladder");
						Trpg.board.setTile(new Trpg.Tile("LadderDown"),wl);
						var newwl = wl.copy();
						newwl.dim = "underground1";
						Trpg.board.save();
						Trpg.board.player.loc.load(newwl);//.copy();
						Trpg.board.player.mx =
						Trpg.board.player.mx = 16;
						Trpg.board.load(Trpg.board.player.loc,true);
						Trpg.board.setTile(new Trpg.Tile("LadderUp"),newwl);
						break;
					case "plant":
						Trpg.board.setTile(new Trpg.Tile("Seedling"),wl);
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.hole,0,0);
			}
			return this;
		}
		function LadderUp(){
			this.type = "LadderUp";
			this.traits.walkable = true;
			this.actions = ["climb"];
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "climb":
						if (Trpg.Home.get("Gameplay").has("currentaction"))
							Trpg.Home.get("Gameplay").remove("currentaction");
						var newwl = wl.copy();
						newwl.dim = "surface";
						Trpg.board.save();
						Trpg.board.player.loc.load(newwl);
						Trpg.board.player.mx =
						Trpg.board.player.mx = 16;
						Trpg.board.load(Trpg.board.player.loc,true);
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.stone,0,0);
				g.drawImage(Trpg.imgs.ladderup,0,0);
			}
			return this;
		}
		function LadderDown(){
			this.type = "LadderDown";
			this.traits.walkable = true;
			this.actions = ["descend"];
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "descend":
						if (Trpg.Home.get("Gameplay").has("currentaction"))
							Trpg.Home.get("Gameplay").remove("currentaction");
						var newwl = wl.copy();
						newwl.dim = "underground1";
						Trpg.board.save();
						Trpg.board.player.loc.load(newwl);
						Trpg.board.player.mx =
						Trpg.board.player.mx = 16;
						Trpg.board.load(Trpg.board.player.loc,true);
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.ladderdown,0,0);
			}
			return this;
		}
		function Seedling(){
			this.type = "Seedling";
			this.actions = [""];
			this.traits.walkable = true;
			var that = this;
			this.growtimer = new Utils.Timer(4).setAuto(true,function(){
				Trpg.board.setTile(new Trpg.Tile("Sapling"),that.wl);
			}).start();
			this.doaction = function(action){
				switch (action) {
					case "walkon":
						Trpg.board.setTile(new Trpg.Tile("DeadSeedling"),this.wl);
						break;
				}
			}
			this.update = function(d){
				this.growtimer.update(d);
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.seedling,0,0);
				this.growtimer.renderp(g);
			}
			return this;
		}
		function DeadSeedling(){
			this.type = "DeadSeedling";
			this.actions = ["dig"];
			this.traits.walkable = true;
			this.doaction = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				var wl = this.wl;
				switch (action) {
					//case "walkon":
					//	Trpg.board.setTile(DeadSeedling.call(new Default()),this.wl);
					//	break;
					case "dig":
						var timer = new Utils.Timer(1).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Hole"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						//Trpg.board.setTile(Hole.call(new Default()),this.wl);
						break;
				}
			}
			this.update = function(d){
				//this.growtimer.update(d);
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.deadseedling,0,0);
				//this.growtimer.render(g);
			}
			return this;
		}
		function Sapling(){
			this.type = "Sapling";
			this.actions = [""];
			var that = this;
			this.growtimer = new Utils.Timer(7).setAuto(true,function(){
				Trpg.board.setTile(new Trpg.Tile("Tree"),that.wl);
			}).start();
			/*
			this.doaction = function(action){
				switch (action) {
					case "walkon":
						Trpg.board.setTile(DeadSeedling.call(new Default()),this.wl);
						break;
				}
			}
			this.getDelay = function(action){
				return 0;
				/*if (!exists(action))
					action = this.getActions()[0];
				if (!this.hasAction(action))
					return 0;
				switch (action){
					case "dig":		return 1.4;
					case "plant":	return 1;
					case "fill":	return .7;
					case "search":	return 1.5;
					case "apple":	return .9;
					default:		return 0;
				}*
			}
			this.loadChanges = function(changes){
			this.growtimer = new Utils.Timer(1).setAuto(true,function(){
				Trpg.board.setTile(Tree.call(new Default()),self.wl);
			}).start();
				this.setStage(changes.stage);
				return this;
			}
			this.getChanges = function(){
				return {stage:this.stage};
			}*/
			this.update = function(d){
				this.growtimer.update(d);
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.sapling,0,0);
				this.growtimer.renderp(g);
			}
			return this;
		}
		function Tree(){
			this.type = "Tree";
			var hasseed = Math.random()<.3;
			this.actions = ["chop","search"];
			this.doaction = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				var wl = this.wl;
				switch (action) {
					case "chop":
						var timer = new Utils.Timer(2.2).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Stump"),wl);
							Trpg.invent.additem(new Trpg.Item("Log"));
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
					case "search":
						var timer = new Utils.Timer(.4).start().setAuto(true,function(){
							if (hasseed){
								Trpg.invent.additem(new Trpg.Item("Seed"))
								hasseed = false;
							}
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			/*			this.getDelay = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				if (!this.hasAction(action))
					return 0;
				switch (action){
					case "chop":	return 1.4;
					case "search":	return 1;
					default:		return 0;
				}
			}
			this.update = function(d){
				//this.growtimer.update(d);
			}*/
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.tree,0,0);
				//this.growtimer.render(g);
			}
			return this;
		}
		function FireBig(){
			this.type = "FireBig";
			this.actions = [""];
			var that = this;
			this.growtimer = new Utils.Timer(4).setAuto(true,function(){
				Trpg.board.setTile(new Trpg.Tile("FireSmall"),that.wl);
			}).start();
			this.update = function(d){
				this.growtimer.update(d);
			}
			/*
			this.doaction = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				var wl = this.wl;
				switch (action) {
					case "dig":
						var timer = new Utils.Timer(1.4).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Hole"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}*/
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.firebig,0,0);
				this.growtimer.renderp(g);
			}
			return this;
		}
		function FireSmall(){
			this.type = "FireSmall";
			this.actions = [""];
			var that = this;
			this.growtimer = new Utils.Timer(3).setAuto(true,function(){
				Trpg.board.setTile(new Trpg.Tile("Grass"),that.wl);
				//drop ashes
			}).start();
			this.update = function(d){
				this.growtimer.update(d);
			}
			this.doaction = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				var wl = this.wl;
				switch (action) {
					case "fuel":
						//var timer = new Utils.Timer(1).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("FireBig"),wl);
						//	Trpg.invent.removeitem()
						// }).setKilloncomp(true);
						//timer.board = true;
						//timer.wl = wl;
						//Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.firesmall,0,0);
				this.growtimer.renderp(g);
			}
			return this;
		}
		function Stump(){
			this.type = "Stump";
			this.actions = ["dig"];
			this.traits.burnable = true;
			this.traits.walkable = true;
			this.doaction = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				var wl = this.wl;
				switch (action) {
					case "dig":
						var timer = new Utils.Timer(1.4).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Hole"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			/*this.getDelay = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				if (!this.hasAction(action))
					return 0;
				switch (action){
					case "dig":		return 1.4;
					//case "plant":	return 1;
					//case "fill":	return .7;
					//case "search":	return 1.5;
					//case "apple":	return .9;
					default:		return 0;
				}
			}
			this.update = function(d){
				//this.growtimer.update(d);
			}*/
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.stump,0,0);
				//this.growtimer.render(g);
			}
			return this;
		}
		function Dirt(){
			this.type = "Dirt";
			this.actions = ["dig"];
			//this.traits.burnable = true;
			//this.traits.walkable = true;
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "dig":
						if (!(Trpg.board.getTile(wl.copy().shift(0,1)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(0,-1)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(1,0)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(-1,0)).traits.walkable))
						  break;
						var timer = new Utils.Timer(.4).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("StoneFloor"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.dirt,0,0);
			}
			return this;
		}
		function StoneFloor(){
			this.type = "StoneFloor";
			this.traits.walkable = true;
			this.render = function(g){
				g.drawImage(Trpg.imgs.stone,0,0);
			}
			return this;
		}
		function Stone(){
			this.type = "Stone";
			this.render = function(g){
				g.drawImage(Trpg.imgs.stone,0,0);
			}
			return this;
		}
		function TinOre(){
			this.type = "TinOre";
			this.actions = ["dig"];
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "dig":
						if (!(Trpg.board.getTile(wl.copy().shift(0,1)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(0,-1)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(1,0)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(-1,0)).traits.walkable))
						  break;
						var timer = new Utils.Timer(1.7).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("StoneFloor"),wl);
							Trpg.invent.additem(new Trpg.Item("Tin"));
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.dirt,0,0);
				g.drawImage(Trpg.imgs.tinore,0,0);
			}
			return this;
		}
		function CopperOre(){
			this.type = "CopperOre";
			this.actions = ["dig"];
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "dig":
						if (!(Trpg.board.getTile(wl.copy().shift(0,1)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(0,-1)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(1,0)).traits.walkable
						  ||Trpg.board.getTile(wl.copy().shift(-1,0)).traits.walkable))
						  break;
						var timer = new Utils.Timer(1.7).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("StoneFloor"),wl);
							Trpg.invent.additem(new Trpg.Item("Copper"));
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.dirt,0,0);
				g.drawImage(Trpg.imgs.copperore,0,0);
			}
			return this;
		}
		function BlueOre(){
			this.type = "BlueOre";
			//this.actions = ["dig"];
			//this.traits.burnable = true;
			this.traits.walkable = true;
			/*this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				var wl = this.wl;
				switch (action){
					case "dig":
						var timer = new Utils.Timer(.7).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("Hole"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
					case "plow":
						var timer = new Utils.Timer(1.2).start().setAuto(true,function(){
							Trpg.board.setTile(new Trpg.Tile("PlowedDirt"),wl);
						}).setKilloncomp(true);
						timer.board = true;
						timer.wl = wl;
						Trpg.Home.add(timer,"Gameplay.currentaction");
						break;
				}
			}*/
			this.render = function(g){
				g.drawImage(Trpg.imgs.dirt,0,0);
				g.drawImage(Trpg.imgs.blueore,0,0);
			}
			return this;
		}
		/*function AppleTree(){
			this.actions = ["pick","chop"];
		}
		function AppleHole(){
			this.actions = [""];
		}
		function RottedAppleHole(){
			this.actions = ["dig"];
		}
		function Grass(stage){
			this.type = "grass";
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "dig":
						this.setStage(1);
						break;
					case "fill":
						this.setStage(0);
						break;
					case "plant":
						Trpg.board.setTile(Tree.call(new Default(),2),this.wl);
						break;
					case "apple":
						Trpg.board.setTile(Tree.call(new Default(),6),this.wl);
						Board.container.get("basket").apples--;
						break;
				}
			}
			this.getActions = function(){
				var acts = [];
				for (var i = 0; i < this.actions.length; i++)
					acts.push(this.actions[i]);
				if (Board.container.get("basket").apples > 0 && this.stage == 1)
					acts.push("apple");
				return acts;
			}
			//this.setState = function(loadobj,loadthis){
			/*this.setState = function(state,target){
				//	this = object to save state into
				//	loadobj = object to load into state
				/*	ex
					//save
					var savestate = this.setState.call(savestate,this,{})
					var savestate = this.setState(this);
					//load
					this.setState(savedstate)
				*
				copyObjTo(state,target);
				
				
				
				copyObjTo(loadobj,this);
				if (loadthis){
					this.setStage();
				}
				return this; // save object
			}*
			this.setStage = function(stage){
				if (!exists(stage))
					stage = this.stage;
				switch (stage){
					case 0:		//grass
						this.stage = 0;
						this.actions = ["dig"];
						break;
					case 1:		//hole
						this.stage = 1;
						this.actions = ["fill","plant","search"];
						break;
				}
			}
			this.setStage(stage || 0);
			this.getDelay = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				if (!this.hasAction(action))
					return 0;
				switch (action){
					case "dig":		return 1.4;
					case "plant":	return 1;
					case "fill":	return .7;
					case "search":	return 1.5;
					case "apple":	return .9;
					default:		return 0;
				}
			}
			this.loadChanges = function(changes){
				this.setStage(changes.stage);
				return this;
			}
			this.getChanges = function(){
				return {stage:this.stage};
			}
			this.update = function(d){}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				if (this.stage == 1)
					g.drawImage(Trpg.imgs.hole,0,0);
			}
			return this;
		}*
		function Portal(){
			this.type = "portal";
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				g.drawImage(Trpg.imgs.gportal,0,0);
			}
			return this;
		}
		function Tree(stage){
			this.type = "tree";
			//Math.random()+Math.random();
			this.traits = {hasbird:Math.random()<.2&&stage==4,hasapples:Math.random()<.35&&(stage==4||stage==6),applesgrown:false};
			this.setWl = function(wl){
				this.wl = wl;
				if (this.stage != 6) return this;
				var random = new Math.seedrandom();
				this.traits = {hasbird:random()<.2&&this.stage==4,hasapples:random()<.35&&(this.stage==4||this.stage==6),grownapple:false};
				this.setStage(this.stage);
				return this;	
			}
			this.setStage = function(stage){
				if (!exists(stage)) stage = this.stage || 4;
				switch (stage){/*
					case -1:	// grass
						this.stage = -1;
						this.traits.walkable = true;
						this.actions = ["dig"];
						this.growtimer = new Utils.Timer(1);
						break;*
					case 0:		// dead seedling
						this.stage = 0;
						this.traits.walkable = true;
						this.actions = ["dig"];
						this.growtimer = new Utils.Timer(1);
						break;
					case 1:		// stump
						this.stage = 1;
						this.traits.walkable = true;
						this.actions = ["dig"];
						this.growtimer = new Utils.Timer(1);
						break;
					case 2:		// seedling
						this.stage = 2;
						this.traits.walkable = true;
						this.actions = [""];
						this.growtimer = new Utils.Timer(5).start();
						break;
					case 3:		// sapling
						this.stage = 3;
						this.traits.walkable = false;
						this.actions = [""];
						this.growtimer = new Utils.Timer(10).start();
						break;
					case 4:		// tree
						this.stage = 4;
						this.traits.walkable = false;
						this.actions = ["chop","search"];
						this.growtimer = new Utils.Timer(1);
						break;
					case 5:		// apple tree
						this.stage = 5;
						this.traits.walkable = false;
						this.actions = ["chop","pick"];
						if (!this.traits.grownapple)
							 this.growtimer = new Utils.Timer(10).start(true);
						else this.growtimer = new Utils.Timer(1);
						break;
					case 6:		// apple hole
						this.stage = 6;
						this.traits.walkable = true;
						this.actions = [""];
						if (this.traits.hasapples)
							this.traits.grownapple = true;
						this.growtimer = new Utils.Timer(5).start();
						break;
					case 7:
						this.stage = 7;
						this.traits.walkable = true;
						this.actions = ["dig"];
						this.growtimer = new Utils.Timer(1);
						break;
					/*case 5:		// hole
						this.stage = 5;
						this.traits.walkable = true;
						this.actions = ["fill","plant","search"];
						this.growtimer = new Utils.Timer(1);
						break;*
				}
			}
			this.setStage(stage);
			//this.firststage = stage || 4;
			//this.stage = stage || 4;
			//this.growtimer = new Utils.Timer();//.start();
			this.state = getState.call(this);
			function getState(){
				return {
					stage:this.stage,
					count:this.growtimer.count,
					traits:this.traits
					//bird:this.traits.hasbird,
					
					//dur:this.growtimer.dur
				}
			}
			function setState(state){
				//this.stage = state.stage;
				this.traits = state.traits;
				this.setStage(state.stage);
				this.growtimer.count = state.count;//.hasbird = state.bird;
			}
			/*function sameState(s1, s2){
				s1 = JSON.stringify(s1);
				s2 = JSON.stringify(s2);
				return s1===s2;
				//return JSON.stringify(s1) == JSON.stringify(s2);
				//for (var p in s1)
				//	if (s1.hasOwnProperty(p) && s2.hasOwnProperty(p))//{
				//		if (s1[p] != s2[p])
				//			return false
			/*
				for (var p in s1)
					if (s1.hasOwnProperty(p))
						if (s2.hasOwnProperty(p)){
							//if (s1[p] != s2[p])
							//	return false;
							//else 
							if (!sameState(s1[p],s2[p]))
								return false;
						} else return false;
					// } else if (s1.hasOwnProperty(p) && !s2.hasOwnProperty(p))
				for (var p in s2)
					if (s2.hasOwnProperty(p))
						if (s1.hasOwnProperty(p)){
							//if (s2[p] != s1[p])
							//	return false;
							if (!sameState(s1[p],s2[p]))
								return false;
						} else return false;
				return s1==s2;*
					//if (s1.hasOwnProperty(p) && s2.hasOwnProperty(p))
			}*
			this.getTrait = function(trait){
				if (this.traits.hasOwnProperty(trait))
					return this.traits[trait];
				return "na";
				//console.log(this.stage);
				//switch (trait){
				//	case "walkable":return this.stage<3||this.stage == 5;
				// }
			}*
			this.getActions = function(){
				switch (this.stage){
					case -1: case 0: case 1:
						return ["dig"];
					case 2: case 3:
						return [""];
					case 4:
						return ["chop","search"];
					case 5:
						return ["fill","plant"];
				}
			}*
			this.getDelay = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				if (!this.hasAction(action))
					return 0;
				switch (action){
					case "chop":	return 2;
					case "dig":		return 1.4;
					case "search":	return 1.5;
					case "pick":	return 1;
					default:		return 0;
				}
			}
			this.doaction = function(action){
				if (!exists(action))
					action = this.getActions()[0];
				if (!this.hasAction(action) && action!="walkon")
					return;
				switch (action){
					case "chop":	
						//if (this.stage == 4){
							this.setStage(1);
							if (this.traits.hasbird){
								Trpg.board.container.add(new Trpg.ShittyBirdThing(),"Birds.");
								this.traits.hasbird = false;
							}
							//this.stage = 1;	
							//this.growtimer.dur = 3;
							//this.growtimer.start();
						// }
						break;
					case "pick":
						if (this.traits.grownapple){
							this.traits.grownapple = false;
							Board.container.get("basket").apples++;
							this.growtimer.start();
						}
						break;
					//case "fill":
						//if (this.stage == 5)
					//		this.setStage(-1);
					//	break;
					case "dig":
						//if (this.stage <= 1)
							Trpg.board.setTile(Grass.call(new Default(),1),this.wl);
							//this.setStage(5);
							//this.stage = 5;
						break;
					//case "plant":	
						//if (this.stage == 5) {
					//		this.setStage(2);
							//this.stage = 2;	
							//this.growtimer.dur = 5;
							//this.growtimer.start();
						// }
					//	break;
					case "search":
						if (this.traits.hasapples)
							this.setStage(5);
						break;
					case "walkon":	
						if (this.stage == 2)	
							this.setStage(0);
						if (this.stage == 6)
							this.setStage(7);
							//this.stage = 0;	
						break;
				}
				//this.setStage();
			}
			this.loadChanges = function(changes){
				setState.call(this,changes.state);
				return this;
				//this.state = getState.call(this);
				//this.state = getState.call(this);
				//console.log("LOAD");
				//console.log(changes.state);
				//console.log(JSON.stringify(this.state)+"\n"+JSON.stringify(getState.call(this)));
				//return;
				//this.firststage = changes.stage;
				//this.stage = changes.stage;
				//if (changes.stage>0&&changes.stage<4){
				//	this.growtimer = new Utils.Timer(changes.dur).start();
				//	this.growtimer.count = changes.count;
				// }// else this.growtimer = new Utils.Timer(-1);
			}
			this.getChanges = function(){
				
				//var s1 = JSON.stringify(this.state);
				//var s2 = JSON.stringify(getState.call(this));
				//if (s1!=s2)
				//	console.log(s1+"\n"+s2+"\n"+sameState(this.state,getState.call(this)))
				if (sameState(this.state,getState.call(this)))
					return "none";
				//var cur = getState.call
				//if (this.firststage == this.stage)
					//return "none";
				var gs = getState.call(this);
				return {
					state:gs
					//stage:this.stage,
					//count:this.growtimer.count,
					//dur:this.growtimer.dur
				}
			}
			this.update = function(d){
				this.growtimer.update(d);
				if (this.growtimer.consume()){
					var before = this.stage;
					switch (this.stage){
						//case 1:
						//	this.stage+=1;
							//this.growtimer.dur = 5;
							//this.growtimer.start();
						//	break;
						case 2:
							this.stage++;
							//this.growtimer.dur = 10;
							//this.growtimer.start();
							break;
						case 3:
							this.stage++;
							if (this.traits.grownapple)
								this.stage++;
							break;
						case 5:
							this.traits.grownapple = true;
							break;
						case 6:
							if (this.traits.hasapples){
								this.stage = 2;
								//this.traits.grownapple = true;
							}
							else this.stage = 7;
						//default:
						//	this.growtimer.dur = 0;
						//	break;
					}
					if (before != this.stage)
						this.setStage();
				}
			}
			this.render = function(g){
				g.drawImage(Trpg.imgs.grass,0,0);
				if (!this.traits.grownapple||this.stage!=5)
				g.drawImage(([
				Trpg.imgs.deadseedling,
				Trpg.imgs.stump,
				Trpg.imgs.seedling,
				Trpg.imgs.sapling,
				Trpg.imgs.tree,
				Trpg.imgs.tree,
				Trpg.imgs.applehole,
				Trpg.imgs.rapplehole])[this.stage],0,0);
				else if (this.stage == 5)
					g.drawImage(Trpg.imgs.appletree,0,0);
				if (this.growtimer.progress()>=1||this.growtimer.progress()<0)
					return;
				g.save();
				g.globalAlpha = .35;
				g.fillStyle = "white";
				g.beginPath();
				g.lineTo(16,16);
				g.arc(16,16,8,-Math.PI/2,2*Math.PI*(-.25+this.growtimer.progress()));
				g.fill();
				g.restore();
			}
			return this;
		}*/
		var tiles = {
			Grass:Grass,
			Hole:Hole,
			Seedling:Seedling,
			DeadSeedling:DeadSeedling,
			Sapling:Sapling,			
			Tree:Tree,
			Stump:Stump,
			PlowedDirt:PlowedDirt,
			FireBig:FireBig,
			FireSmall:FireSmall,
			Dirt:Dirt,
			LadderDown:LadderDown,
			LadderUp:LadderUp,
			Stone:Stone,
			StoneFloor:StoneFloor,
			TinOre:TinOre,
			CopperOre:CopperOre,
			BlueOre:BlueOre
		}
		return tiles[type].apply(new Default());
	}
	this.Chunk = function(x,y,d){
		this.wl = new Trpg.WorldLoc(x,y,0,0,d);
		/*function generateTile(val){
			switch (this.wl.dim){
				case "surface":
					if (val < .2)
						return new Trpg.Tile("Tree");
					else return new Trpg.Tile("Grass");
					break;
				case "underground1":
				
					break;
			}
		}*/
		this.generate = function(){
			this.code = "x"+x+"y"+y+"d"+d;
			Math.seedrandom(Trpg.world.wseed+this.code);
			this.tiles = [];
			this.origtiles = [];
			switch (d){
				case "surface":
					for (var i = 0; i < 8; i++){
						var row = [];
						var orow = [];
						for (var j = 0; j < 8; j++){
							var t = (function(){
								if (Math.random()<.2)
									return new Trpg.Tile("Tree");
								else return new Trpg.Tile("Grass");
							})().setWl(this.wl.copy().shift(j,i));
							//var t = generateTile(Math.random()).setWl(this.wl.copy().shift(j,i));
							row.push(t);
							orow.push(t);
						}
						this.tiles.push(row);
						this.origtiles.push(orow);
					}
					break;
				case "underground1":
					for (var i = 0; i < 8; i++){
						var row = [];
						var orow = [];
						for (var j = 0; j < 8; j++){
							var t = new Trpg.Tile("Dirt").setWl(this.wl.copy().shift(j,i));
							row.push(t);
							orow.push(t);
						}
						this.tiles.push(row);
						this.origtiles.push(orow);
					}
					if (Math.random()<.15){
						var type = (function(){if (Math.random()<.5)return "TinOre";return "CopperOre"})()
						var amt = Math.floor(Math.random()*10+10);
						for (var i = 0; i < amt; i++){
							var tx = Math.floor(Math.random()*8);
							var ty = Math.floor(Math.random()*8);
							this.tiles[tx][ty] = new Trpg.Tile(type).setWl(this.wl.copy().shift(ty,tx));;
							this.origtiles[tx][ty] = new Trpg.Tile(type).setWl(this.wl.copy().shift(ty,tx));;
						}
					}
					break;
			}			
			if (Trpg.world.changed.indexOf(this.code)!=-1)
				this.loadChanges();
			return this;
		}
		this.getTile = function(wl){
			return this.tiles[wl.cy][wl.cx];
		}
		this.setTile = function(tile, wl){
			this.tiles[wl.cy][wl.cx] = tile.setWl(wl.copy());
		}
		this.loadChanges = function(){
			var changes = JSON.parse(Trpg.world.changes[this.code]);
			for (var i = 0; i < changes.length; i++){
				this.tiles[changes[i].i][changes[i].j] = new Trpg.Tile(changes[i].type).setWl(this.wl.copy().shift(changes[i].j,changes[i].i));
				this.tiles[changes[i].i][changes[i].j].update(changes[i].count);
			}
		}
		this.getChanges = function(){
			var changes = [];
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					if (this.tiles[i][j].type!=this.origtiles[i][j].type)
						if (exists(this.tiles[i][j].growtimer))
							 changes.push({i:i,j:j,type:this.tiles[i][j].type,count:this.tiles[i][j].growtimer.count});
						else changes.push({i:i,j:j,type:this.tiles[i][j].type,count:0});
			if (changes.length == 0)
				return "none";
			if (Trpg.world.changed.indexOf(this.code)==-1)
				Trpg.world.changed.push(this.code);
			return (JSON.stringify(changes));
		}
		this.update = function(d){
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					this.tiles[i][j].update(d);
		}
		this.render = function(g){
			g.translate(32*(8*x-0*Trpg.board.player.loc.cx),32*8*y);
			for (var i = 0, wl; i < 8; i++){
				for (var j = 0; j < 8; j++){
					wl = new Trpg.WorldLoc(x,y,j,i,d);
					
					if (Trpg.board.player.loc.dist(wl) < Trpg.board.viewsize)
						this.tiles[i][j].render(g);
					
					if (Trpg.board.aim!=-1 && exists(Trpg.board.aim))
						if (Trpg.board.aim.dist(wl)==0)
							g.strokeRect(0,0,32,32);
						
					if (Trpg.board.ground.hasitems(wl))
						Trpg.board.ground.render(g,wl);
						
					if (Trpg.Home.get("Gameplay").has("currentaction")
						&& Trpg.Home.get("Gameplay.currentaction").board
						&& Trpg.Home.get("Gameplay.currentaction").wl.dist(wl) == 0)
						Trpg.Home.get("Gameplay.currentaction").renderp(g);
					
					if (false&&Trpg.toolbox.container.has("actiondelay")
						&& Trpg.toolbox.actingwl !== -1
						&& Trpg.toolbox.actingwl.dist(wl) == 0 
						&& Trpg.toolbox.container.get("actiondelay").progress()<1)
						Trpg.toolbox.container.get("actiondelay").renderp(g);
						
					g.translate(32,0);
				}
				g.translate(-8*32,32);
			}
		}
	}
}