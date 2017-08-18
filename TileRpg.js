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
		this.getadjs = function(){
			return [(this.copy().shift(0,-1)),
					(this.copy().shift(1,0)),
					(this.copy().shift(0,1)),
					(this.copy().shift(-1,0))]
		}
		this.shift = function(dx,dy,dim){
			this.cx+=dx||0;
			this.cy+=dy||0;
			this.dim = dim || this.dim;
			return this.legalize();
		}
		this.tochunk = function(){
			this.cx = this.cy = 0;
			return this;
		}
		this.dim = dim || "surface";
		this.chunkdist = function(other){
			return Math.max(Math.abs(other.wx-this.wx),Math.abs(other.wy-this.wy));
		}
		this.dist = function(other, min){
			//if (other.dim !== this.dim)	return -1;
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
			return this;
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
			//t.color = "grey";
			t.cropper = false;
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
			var b,h,i,m;
			g.add(b = new UI.DBox(0,0,800,800),"Board");
			//g.add(h = new UI.DBox(800,0,400,800),"Hud");
			g.add(i = new UI.DBox(800,300,400,500),"Invent");
			g.add(m = new UI.DBox(800,0,400,300),"Minimap");
			g.add(new UI.DBox(),"Menus");
			i.color = "rgb(96,96,96)";
			b.bcolor = b.color = /*h.color = h.bcolor = */i.bcolor = m.color = "black";
			m.add(Trpg.Map);
			
			return g;
			/*H.add(new Utils.KeyListener("down","Escape",function(){H.prevtab()}));
			Board.add(new Utils.KeyListener("down","p",function(){H.settab("Instructions");}));
			H.settab("TitleMenu");
			H.add(new UI.Button(500,500,200,50).sets({color:"red",text:"Instructions",key:"i",onclick:function(){U.settab("Instructions")}}),"TitleMenu.");*/
		}
			//H.add(new Utils.KeyListener("down","m",function(){Trpg.Map.invisible = false;}));
			/*H.add(new Utils.KeyListener("down","o",function(){
				Trpg.invent.additem(new Trpg.Item("Tin"));
				Trpg.invent.additem(new Trpg.Item("Copper"));
			}));
			H.add(new Utils.KeyListener("down","b",function(){
				Trpg.invent.additem(new Trpg.Item("BronzeBar"));
			}));
			/*H.add(new Utils.KeyListener("down","u",function(){
				if (Trpg.board.cloc.dim=="surface")
					Trpg.board.cloc.dim = "underground1";
				else
					Trpg.board.cloc.dim = "surface";
				Trpg.board.load(Trpg.board.cloc,true);
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
			H.add(Trpg.invent,"Gameplay.Invent.")
			if (newgame)
			//Invent.add(Trpg.invent);
				localStorage.removeItem("TRPGSaveSlot");//+this.slot);
			if (localStorage.getItem("TRPGSaveSlot"/*+this.slot*/)!=null)
				Trpg.world.loadChanges(JSON.parse(localStorage.getItem("TRPGSaveSlot"/*+this.slot*/)));
			
			window.onbeforeunload = Trpg.SaveGame;
			H.settab("Gameplay");
		}
	}
	/*this.ShittyBirdThing = function(){
		this.wl = Trpg.board.cloc.copy();
		this.wl.wx+=Math.floor(Math.random()*2-1);
		this.wl.wy+=Math.floor(Math.random()*2-1);
		this.mx = this.my = 16;
		this.kill = function(){
			Board.container.get("killcounter").count++;
			this.container.remove(this);
		}
		this.update = function(d){
			//return;
			var dx = this.wl.dx(Trpg.board.cloc);
			var dy = this.wl.dy(Trpg.board.cloc);
			//console.log(dx+" "+dy);
			if (dx==0&&dy==0){
				Board.container.get("healthbar").health--;
				this.container.remove(this);
				return;
			}
			dx*=32;
			dx+=Trpg.board.mx-this.mx;
			dy*=32;
			dy+=Trpg.board.my-this.my;
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
			var dx = this.wl.dx(Trpg.board.cloc)*-32+this.container.container.camera.x+this.mx-Trpg.board.mx;
			var dy = this.wl.dy(Trpg.board.cloc)*-32+this.container.container.camera.y+this.my-Trpg.board.my;
			g.fillStyle = "brown";
			g.fillRect(dx-8,dy-8,16,16);
		}
	}*/
	this.World = function(seed){
		/*Trpg.imgs = {
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
			bportal:Ast.i("bportal"),
			gportal:Ast.i("gportal"),
			stone:Ast.i("stone"),
			cwallu:Ast.i("cwallu"),
			cwalll:Ast.i("cwalll"),
			cwallt:Ast.i("cwallt"),
			cwallx:Ast.i("cwallx"),
			cwallv:Ast.i("cwallv"),
			cwallc:Ast.i("cwallc"),
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
		}*/
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
		//Trpg.invent.additem(new Trpg.Item("Tinderbox"));
		//Trpg.invent.additem(new Trpg.Item("Hoe"));
		//Trpg.invent.additem(new Trpg.Item("Hammer"));
		//Trpg.invent.additem(new Trpg.Item("Ladder"));
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
			//console.log(changes);
			this.changed = changes.changed;
			this.changes = changes.changes;
			this.wseed = changes.seed;
			//console.log(changes);
			//var und;
			
			//taken out to avoid duplicate toolboxes
			//Trpg.board.init();
			
			
			//console.log(changes.ploc);
			//console.log(new Trpg.WorldLoc().copy());
			Trpg.board.cloc.load(changes.cloc);
			Trpg.board.loaded = [];
			Trpg.board.load(Trpg.board.cloc,true);
			//Trpg.invent = new Trpg.Invent();
			//console.log(changes.invent);
			Trpg.Map.load(changes.map);
			Trpg.invent.loadsave(changes.invent);
		}
		this.getChanges = function(){
			Trpg.board.save();
			var d = new Trpg.WorldLoc(0,0,3,3).dist(Trpg.board.cloc);
			//var d = Trpg.board.player.firstloc.dist(Trpg.board.cloc);
			//if (this.changes.length == 0 && d == 0){
			//	alert("swdefr");
			//	return "none"
			// }
				//return "none";
			var loc = (Trpg.board.cloc.copy());
			return {
				changed:this.changed,
				changes:this.changes,
				seed:this.wseed,
				cloc:loc,
				invent:Trpg.invent.getsave(),
				map:Trpg.Map.save()
			}
		}
	}
	/*function Player(wl){
		this.loc = wl || new Trpg.WorldLoc(0,0,3,3);
		this.mx = this.my = 16;
		/*return {
				/*img:{
					n:Ast.i("playerN"),
					s:Ast.i("playerS"),
					e:Ast.i("playerE"),
					w:Ast.i("playerW")
				},*
				loc:wl||new Trpg.WorldLoc(0,0,3,3),
				mx:16,my:16,
				/*tool:"none",
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
				tools:{}*
			};*
	}*/
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
			var x = Math.floor((m.relx(Trpg.Home.get("Gameplay.Invent"))-25)/Trpg.Home.get("Gameplay.Invent").cumZoom()/64)
			var y = Math.floor((m.rely(Trpg.Home.get("Gameplay.Invent"))-15)/Trpg.Home.get("Gameplay.Invent").cumZoom()/64);
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
				if (save[i] !== "empty" && exists(save[i].t)){
					//console.log(save[i]);
					this.spaces[i] = new Trpg.Item(save[i].t);
					this.spaces[i].amt = save[i].a;
					this.spaces[i].space = i;
				} else if (save[i] == "empty")
					this.spaces[i] = "empty";
				
			//for (var i = 0; i < 35; i++)
			//	console.log(this.spaces[i].space);
			/*if (!this.hasitem("Tinderbox"))
				this.additem(new Trpg.Item("Tinderbox"));
			if (!this.hasitem("Hoe"))
				this.additem(new Trpg.Item("Hoe"));*/
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
		this.getitemamt = function(item){
			for(var i = 0; i < 35; i++)
				if (!this.hasitem(item,i))
					return i;
		}
		this.dropitem = function(item){
			Trpg.board.ground.dropitem(item,Trpg.board.cloc);
			if (!item.infinite)
				this.spaces[item.space] = "empty";
		}
		this.removeitem = function(item,amt){
			if (item.infinite)	return;
			amt = amt || 1;
			while (amt > 0){
				if (typeof item == "string"){
					for (var i = 0; i < 35; i++)
						if (this.spaces[i] !== "empty" && this.spaces[i].type == item){
							this.spaces[i].amt--;
							break;
						}
				}
				else 	this.spaces[item.space].amt--;
				for (var i = 0; i < 35; i++)
					if (this.spaces[i] !== "empty" && this.spaces[i].amt < 1)// && !this.spaces[i].infinite)
							this.spaces[i] = "empty";
				amt--;
			}
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
			this.stackable = false;
			this.infinite = false;
			this.setinfinite = function(inf){
				this.infinite = inf;
				return this;
			}
			this.copy = function(){
				return new Trpg.Item(this.type).setinfinite(this.infinite);
			}
			this.actions = ["use","drop"];
			this.amt = 1;
			this.setamt = function(amt){
				this.amt = amt;
				return this;
			}
			this.useon = function(on){
				Trpg.invent.using = -1;
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						//console.log(Trpg.invent.using);
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.useon = function(on){	}
			this.getActions = function(){	return this.actions;	}
			this.hasAction = function(action){	return this.getActions().indexOf(action)!=-1;}
			this.render = function(g,x,y){}
		}
		var items = {
			Log:function(){
				this.type = "Log";
				var that = this;
				this.actions = ["use","drop"];
				this.useon = function(on){
					Trpg.invent.using = -1;
					switch (on.type){
						case "Tinderbox":
							this.doaction("light");
							break;
						case "FireSmall":
							//var timer = new Utils.Timer(1).start().setAuto(true,function(){
								on.doaction("fuel");
								//Trpg.board.setTile(new Trpg.Tile("FireBig"),on.wl);
								Trpg.invent.removeitem(that);
							break;
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
							if (!Trpg.board.getTile(Trpg.board.cloc).getTrait("burnable"))
								return;
							var timer = new Utils.Timer(1.3).start().setAuto(true,function(){
								Trpg.board.setTile(new Trpg.Tile("FireBig"),Trpg.board.cloc);
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
					
					g.drawImage(Ast.i("log"),x,y);
					g.fillStyle = "yellow";
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Seed:function(){
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
				this.render = function(g,x,y){
					g.fillStyle = "yellow";
					g.fillText("Seed",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Tin:function(){
				this.type = "Tin";
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
					g.drawImage(Ast.i("tinore"),x,y);
					g.fillStyle = "yellow";
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Copper:function(){
				this.type = "Copper";
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
					g.drawImage(Ast.i("copperore"),x,y);
					g.fillStyle = "yellow";
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Bar:function(type){
				this.type = type+"Bar";
				this.render = function(g,x,y){
					g.drawImage(Ast.i(type.toLowerCase()+"bar"),x,y);
				}
				return this;
			},
			BronzeBar:function(){
				//console.log(this);
				return items.Bar.call(this,"Bronze");
				//return this;
				//return items.Bar("Bronze");
			},
			BronzeDagger:function(){
				this.type = "BronzeDagger";
				this.render = function(g,x,y){
					//g.drawImage(Ast.i("bronzebar"),x,y);
					g.fillStyle = "yellow";
					Drw.drawCText(g,"Dagger",x+16,y+16);
					//g.fillText("Dagger",x-5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			BronzeHelm:function(){
				this.type = "BronzeHelm";
				this.render = function(g,x,y){
					//g.drawImage(Ast.i("bronzebar"),x,y);
					g.fillStyle = "yellow";
					g.fillText("Helm",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			BronzeKite:function(){
				this.type = "BronzeKite";
				this.render = function(g,x,y){
					//g.drawImage(Ast.i("bronzebar"),x,y);
					g.fillStyle = "yellow";
					g.fillText("Kite",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			BronzeLegs:function(){
				this.type = "BronzeLegs";
				this.render = function(g,x,y){
					//g.drawImage(Ast.i("bronzebar"),x,y);
					g.fillStyle = "yellow";
					g.fillText("Legs",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			BronzeBody:function(){
				this.type = "BronzeBody";
				this.render = function(g,x,y){
					//g.drawImage(Ast.i("bronzebar"),x,y);
					g.fillStyle = "yellow";
					g.fillText("Body",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			IronBar:function(){
				this.type = "IronBar";
				this.render = function(g,x,y){
					g.drawImage(Ast.i("ironbar"),x,y);
					g.fillStyle = "yellow";
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Ladder:function(){
				this.type = "Ladder";
				this.render = function(g,x,y){
					g.drawImage(Ast.i("ladderup"),x,y);
					g.fillStyle = "yellow";
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Tinderbox:function(){
				this.type = "Tinderbox";
				this.useon = function(on){
					Trpg.invent.using = -1;
					switch (on.type){
						case "Log":
							on.doaction("light");
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
			},
			Hoe:function(){
				this.type = "Hoe";
				this.actions = ["use"];
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
						//case "drop":
						//	Trpg.invent.dropitem(this);
						//	break;
					}
				}
				this.render = function(g,x,y){
					g.fillStyle = "yellow";
					g.fillText("Hoe",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Hammer:function(){
				this.type = "Hammer";
				this.render = function(g,x,y){
					g.fillStyle = "yellow";
					g.fillText("Hammer",x-5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
		}
		var i = items[type].apply(new Default());
		console.log(i);
		return i;
	}
	this.Map = new (function(){
		/*this.chunks = [];
		this.addchunk = function(chunk){
			this.chunks.push({
				wl:chunk.wl.copy(),
				img:chunk.getimg()
			})
		}*/
		this.save = function(){
			var loaded = [];
			for (var p in this.tiles)
				loaded.push({wl:p,t:this.tiles[p]});
				//loaded.push(JSON.stringify(this.tiles[p].wl));
			return loaded;
		}
		this.load = function(loads){
			for (var i = 0; i < loads.length; i++)
				this.tiles[loads[i].wl] = loads[i].t;
				//this.addtile(Trpg.board.getTile(JSON.parse(loads[i])));
		}
		this.tiles = {};
		this.addtile = function(tile){
			var t = this.tiles[tile.wl.toStr()];
			if (!exists(t))
				this.tiles[tile.wl.toStr()] = {c:tile.getcolor(),v:tile.wl.dist(Trpg.board.cloc)<=Trpg.board.viewsize};
			else this.tiles[tile.wl.toStr()].c = tile.getcolor();
			//if (!exists(this.tiles[tile.wl.toStr()])
			//var o = {wl:tile.wl,col:tile.getcolor()};
			//if (this.tiles.indexOf(o) == -1)
			//	this.tiles.push(o);
		}
		this.init = function(){
			this.r = 30;
			this.s = 6;
			this.container.camera.centerZero();
			//this.invisible = true;
		}
		this.mousedown = function(e,m){
			if (e.button !== 0)	return;
			if (this.container.mouseonbox(m)){
				//this.container.fullscreen = !this.container.fullscreen;
				//return;
				if (this.container.fullscreen){
					this.r = 30;
					this.s = 6;
					this.container.x = 800;
					this.container.y = 0;
					this.container.w = 400;
					this.container.h = 300;
					this.container.camera.reset();
					this.container.camera.centerZero();
					Trpg.Home.get("Gameplay.Menus").invisible = false;
					
				} else {//*
					this.r = 35;
					this.s = 12;
					this.container.x = 0;
					this.container.y = 0;
					this.container.w = 800;
					this.container.h = 800;
					this.container.camera.reset();
					this.container.camera.centerZero();//*/
					Trpg.Home.get("Gameplay.Menus").invisible = true;
				//alert("clicked on"+this.container.systemname);
				//	Trph.board.invisible = true;
				}
				this.container.fullscreen = !this.container.fullscreen;
				return true;
			}
		}
		this.render = function(g){
			g.translate(-Trpg.board.mx*this.s/32,-Trpg.board.my*this.s/32);
			for (var i = -this.r; i < this.r; i++)
				for (var j = -this.r; j < this.r; j++){
					var wl = Trpg.board.cloc.copy().shift(i,j);
					var t = this.tiles[wl.toStr()];
					if (!exists(t))	continue;
					if (!t.v && Trpg.board.cloc.dist(wl)<=Trpg.board.viewsize)	t.v = true;
					if (!t.v)		continue;
					g.fillStyle = t.c;
					//g.fillStyle = Trpg.board.getTile().getcolor();
					g.fillRect(this.s*i,this.s*j,this.s+1,this.s+1);
				}
			g.translate(Trpg.board.mx*this.s/32,Trpg.board.my*this.s/32);
			g.fillStyle = "white";
			g.fillRect(-this.s/2,-this.s/2,this.s+1,this.s+1);
		}
	})();
	function feedback(str,x,y,l){
		var sx = x;
		var sy = y;
		this.init = function(){
			this.timer = new Utils.Timer(l||2).start();
			this.rl = 2;
			/*var timer = new Utils.Timer(delay).start().setAuto(true,function(){
				infunc();
			}).setKilloncomp(true);*/
		}
		this.update = function(d){
			this.timer.update(d);
			if (this.timer.consume())
				this.container.remove(this);
		}
		this.render = function(g){
			var x = sx;
			var y = sy;
			if (this.container.systemname=="Board"){
				x-=Trpg.board.mx;
				y-=Trpg.board.my;
			}
			var w = g.measureText(str).width+5;
			var h = g.measureText("M").width+5;
			g.fillStyle = "white";
			g.globalAlpha = .5;
			g.fillRect(x-w/2,y-h/2,w,h);
			g.globalAlpha = 1;
			g.fillStyle = "black";
			//Drw.drawCText(g,str,sx-Trpg.board.mx,sy-Trpg.board.my);
			//g.font = (parseInt(g.font.substring(0,g.font.indexOf("px")))-1)+g.font.substring(g.font.indexOf("px"));
			//g.fillStyle = "white";
			Drw.drawCText(g,str,x,y);
		}
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
			if (s == 0)	return;
			box.empty();
			box.h = s*35;
			box.w = 135;//Math.ceil(actions.length/s)*50;
		//	console.log(box.w+" "+box.h);
			for (var i = 0; i < actions.length; i++){
				var btn = new UI.Button(0,i*35,135,35);//Math.floor(i/s)*75,i%s*25,75,25);
				btn.toolname = actions[i];
				btn.text = actions[i].charAt(0).toUpperCase()+actions[i].substring(1);
				/*btn.inrender = function(g){
					//g.fillStyle = "darkgrey";
					//if (box.curtool == this.toolname)
						g.fillStyle = "black";
					g.font = "15px Arial";
					var a = this.toolname;
					Drw.drawCText(g,a.charAt(0).toUpperCase()+a.substring(1),this.w/2,this.h/2);
				}*/
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
					var btn = new UI.Button(0,box.h,135,35);
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
					var btn = new UI.Button(0,box.h+35*i,135,35);
					btn.color = "orange";
					btn.text = items[i].item.type;
					btn.i = i;
					btn.item = items[i];
					btn.onclick = function(){
						Trpg.invent.additem(this.item.item);
						items.splice(items.indexOf(this.item),1);
						//Trpg.invent.additem(items.splice(this.i,1)[0].item);
						box.remove(this);
						box.h-=35;
						if (items.length == 0){
							box.empty();
							box.hidden = true;
						} else {
							var q = box.getq();
							for (var p in q){
								if (exists(q[p].systemname) && 
									q[p].systemname.indexOf("item")!==-1 && 
									parseInt(q[p].systemname.substring(4)) >= this.i){
										q[p].y-=35;
								}
							}
						}
						return true;
					}
					box.add(btn,"item"+i);
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
			if (Trpg.invent.using != -1){
				Trpg.invent.using.useon(tile);
				Trpg.invent.using = -1;
				return;
			}
			//console.log("not using");
			if (tile.getActions().length == 0)
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
			//console.log(tile);
			tile.doaction();
			//console.log(Trpg.invent.using);
			return;
			
			
			//box.actingwl = wl.copy();
			//box.empty();
			//box.hidden = true;
			//var timer = new Utils.Timer(tile.getDelay()*.2*(2+wl.dist(Trpg.board.cloc))).start().setAuto(true, 
			//	function(){tile.doaction();box.actingwl = -1}).setKilloncomp(true);
			//if (box.container.has("actiondelay"))
			//	box.container.remove("actiondelay");
			//box.container.add(timer,"actiondelay");
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
		Trpg.Home.get("Gameplay.Menus").add(new (function(){
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
				else if (Trpg.Home.get("Gameplay.Invent").mouseonbox(m)){
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
				//Trpg.invent.using = -1;
			}
		})(),"toolclicker");
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
					var newchunk = new Trpg.Chunk(wl.wx+i,wl.wy+j,wl.dim).generate();
					this.loaded.push(newchunk);
					Trpg.Structures.checkchunk(newchunk.wl);
					//if (Trpg.Structures.hasstruct(newchunk.wl))
					//	Trpg.Structures.fillchunk(newchunk.wl);
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
			//Trpg.Structures.checkcenters(wl);
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
			return new Trpg.Chunk(wl.wx,wl.wy,wl.dim).generate().getTile(wl);
		}
		this.setTile = function(tile, wl){
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.chunkdist(wl)==0)
					this.loaded[i].setTile(tile,wl.copy());
		}
		this.init = function(){
			//console.log("initing");
			this.loaded = [];
			Trpg.Home.add(Trpg.toolbox = new ToolBox(),"Gameplay.Menus.");
		Trpg.Structures.init();
			//this.player = new Player();
			this.mx = this.my = 16;
			this.cloc = new Trpg.WorldLoc(-1,1,3,3);
			this.running = false;
			this.runenergy = 100;
			//this.cloc.dim = "underground1";
			this.load(this.cloc,true);
			//this.setTile(new Trpg.Tile("StoneFloor").setWl(this.cloc),this.cloc);
			while (!this.getTile(this.cloc).getTrait("walkable")){
				this.cloc.cx+=Math.floor(Math.random()*2-1);
				this.cloc.cy+=Math.floor(Math.random()*2-1);
				this.cloc.legalize();
			//	console.log(this.cloc.toStr());
			//console.log(this.getTile(this.cloc).getTrait("walkable"));
			}
			//this.player.firstloc = this.cloc.copy();
			//console.log(this.getTile(this.cloc).getTrait("walkable"));
			//this.load(this.cloc);
			
			this.dx = 0;
			this.dy = 0;
			//this.center.container = this.container;
			this.viewsize = 7;
			this.container.camera.zoomto(1/(this.viewsize-1)/64*this.container.w);
			this.container.add(new UI.Follow(this.container.camera,this.cloc,0,0,32));
		}
		this.keydown = function(k){
			switch (k.code){
				case "Space":
					this.running = !this.running;
					break;
				case "ControlLeft":
					this.forcing = !this.forcing;
					break;
			}
			//if (k.name != "esc")	return;
			//console.log(Trpg.world.getChanges());
			//return false;
		 }
		/*this.mousedown = function(e,m){
			if (this.aim == -1 || (e.button != 0 && e.button !=2))
				return;
			Trpg.toolbox.moveToMouse(m);
			if (e.button == 2){
				Trpg.toolbox.open((this.aim.copy()));
				return;
			}
			Trpg.toolbox.clicked(this.aim.copy());
		}
			
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
			
			var x = m.relx(fakecam)/this.container.cumZoom()+this.mx-16;
			var y = m.rely(fakecam)/this.container.cumZoom()+this.my-16;
			/*if (x > 64)		x = 64;
			if (x < -64)	x = -64;
			if (y > 64)		y = 64;
			if (y < -64)	y = -64;
			*///if (Ms.reld(fakecam) >= 64*this.container.cumZoom()) {
			//	x = 64*Math.cos(Ms.rela(fakecam));
			//	y = 64*Math.sin(Ms.rela(fakecam));
			// }
			this.aim = this.cloc.copy();
			this.aim.cx+=Math.round(x/32);
			this.aim.cy+=Math.round(y/32);
			this.aim.legalize();
			
			if (//Trpg.toolbox.curtool == "none" || 
				!this.container.mouseonbox(m))//  ||
				//this.aim.dist(this.cloc) > 2)
				//!Trpg.toolbox.inRange(this.aim.dist(this.cloc)))
					this.aim = -1;
					return;
			/*
			if (Trpg.toolbox.curtool == "none" || 
				!this.container.mouseonbox(Ms.getMouse()) ){// ||
				//!Trpg.toolbox.inRange(this.aim.dist(this.cloc)))
				this.aim = -1;return;}
			var temp = this.cloc.copy();
			var valid = false;
			var a = Math.atan2(y,x);
			for (var i = 0; i < Math.sqrt(x*x+y*y); i++){
				var valid = Trpg.toolbox.inRange(temp.dist(this.cloc));
				if (valid)	this.aim = temp.copy();
				temp.cx+=Math.round(i*Math.cos(a));
				temp.cy+=Math.round(i*Math.sin(a));
				temp.legalize();
				if (valid && !Trpg.toolbox.inRange(temp.dist(this.cloc)))
					break;
				
			}
			return;
			
			this.aim = this.cloc.copy();
			this.aim.cx+=Math.round(x/32);
			this.aim.cy+=Math.round(y/32);
			this.aim.legalize();
			
			if (Trpg.toolbox.curtool == "none" || 
				!this.container.mouseonbox(Ms.getMouse()) )// ||
				//!Trpg.toolbox.inRange(this.aim.dist(this.cloc)))
					this.aim = -1;
			if (this.aim!=-1 && !Trpg.toolbox.inRange(this.aim.dist(this.cloc))){
				var d = this.aim.dist(this.cloc);
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
				var a = Math.atan2(this.cloc.dy(this.aim),this.cloc.dx(this.aim));
				var dd = Math.sqrt(32*32*(this.cloc.dy(this.aim)*this.cloc.dy(this.aim)+this.cloc.dx(this.aim)*this.cloc.dx(this.aim)));
				
				do {
					//start.cx+=Math.cos(a)*ddist;
					//start.cy+=Math.sin(a)*ddist;
					
					//start.legalize();
					
					this.aim.cx+=Math.floor(Math.floor(dd*Math.cos(a))%32/32)*ddist;
					this.aim.cy+=Math.floor(Math.floor(dd*Math.sin(a))%32/32)*ddist;
					this.aim.legalize();
					alert(this.aim.toStr()+" "+this.cloc.dist(this.aim));
					dd--;
					
					//var x = this.cloc.dx(this.aim);
					//var y = this.cloc.dy(this.aim);
					
					//if (Math.abs(x) > Math.abs(y)){
					//	this.aim.cx+=ddist;
					// }
					
					
					//Math.sign(this.cloc.dx(this.aim))*ddist;
					//start.cy+=Math.sign(this.cloc.dy(this.aim))*ddist;
					//this.aim.cx = Math.round(start.cx);//+=Math.sign(this.cloc.dx(this.aim))*ddist;
					//this.aim.cy = Math.round(start.cy);//+=Math.sign(this.cloc.dy(this.aim))*ddist;
					//b--;
				} while (!Trpg.toolbox.inRange(this.aim.dist(this.cloc))&&dd>0);
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
			
			if (K.Keys.W.down || K.Keys.up.down)	this.dy--;
			if (K.Keys.A.down || K.Keys.left.down)	this.dx--;
			if (K.Keys.S.down || K.Keys.down.down)	this.dy++;
			if (K.Keys.D.down || K.Keys.right.down)	this.dx++;
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
			var speed = 170*dlt;
			/*var speed = 100*dlt;
			if (this.running && this.runenergy > 0 && (this.dx!=0||this.dy!=0)){
				speed*=2;
				this.runenergy-=3*dlt;
			}
			if (this.runenergy <= 0)
				this.running = false;
			
			if ((!this.running || (this.dx==0&&this.dy==0)) && this.runenergy<100)
				this.runenergy+=1*dlt;
			*/
			//if (this.dx!=0&&this.dy!=0)
			//	speed/=Math.sqrt(2);
			this.mx+=this.dx*speed;
			this.my+=this.dy*speed;
			var loc = this.cloc.copy();
			if (this.mx < 0 || this.mx >= 32){
				loc.cx+=this.dx;
				//this.cloc.cx+=this.dx;
				loc.legalize();
				//this.cloc.legalize();
				if (this.forcing)
					this.getTile(loc).doaction("walkon");
				if (!this.getTile(loc).getTrait("walkable")){
				//if (!this.getTile(this.cloc).getTrait("walkable")){
					loc.cx-=this.dx;
					//this.cloc.cx-=this.dx;
					this.mx-=this.dx*speed;
				} else {
					this.mx-=32*this.dx;
				}
			}
			if (this.my < 0 || this.my >= 32){
				loc.cy+=this.dy;
				//this.cloc.cy+=this.dy;
				loc.legalize();
				//this.cloc.legalize();
				if (this.forcing)
					this.getTile(loc).doaction("walkon");
				if (!this.getTile(loc).getTrait("walkable")){
				//if (!this.getTile(this.cloc).getTrait("walkable")){
					loc.cy-=this.dy;
					//this.cloc.cy-=this.dy;
					this.my-=this.dy*speed;
				} else {
					this.my-=32*this.dy;
				}
			}
			loc.legalize();
			if (this.cloc.dist(loc)!=0){
				this.getTile(loc).doaction("walkon");
				if (Trpg.Home.get("Gameplay").has("currentaction"))
					Trpg.Home.get("Gameplay").remove("currentaction");
			}
			this.cloc.load(loc);
			//this.cloc.wx = loc.wx;
			//this.cloc.wy = loc.wy;
			//this.cloc.cx = loc.cx;
			//this.cloc.cy = loc.cy;
			if (this.rcenter.dist(this.cloc)>4||this.lcenter.dist(this.cloc)>4)
				this.load(this.cloc);
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
			Trpg.Entities.update(dlt);
		}
		this.render = function(g){
			//g.translate(-32*this.center.cx,-32*this.center.cy);
			//if (!this.cd.ready())
				g.save();
				g.translate(-this.mx,-this.my);
				//g.translate(32*this.mx*(1-this.cd.progress()),32*this.my*(1-this.cd.progress()));
			for (var i = 0; i < this.loaded.length; i++){
				g.save();
				this.loaded[i].render(g);
				g.restore();
			}
			g.restore();
				//g.fillStyle = "white";
				//g.fillRect(this.container.camera.x-2,this.container.camera.y-2,4,4);
				g.save();
				g.translate(this.container.camera.x-16,this.container.camera.y-16)
				g.drawImage(Ast.i("playerS"),0,0);
				Trpg.Entities.render(g);
				g.restore();
				g.save();
				g.fillStyle = "black";
				g.font = "10px Arial";
				g.globalAlpha = .25;
				g.fillText(this.cloc.toStr(),this.container.getbounds().l+2,this.container.getbounds().u+10);
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
	this.Entities = new (function(){
		this.Entity = function(type,wl){
			function Default(wl){
				this.spawn = wl.copy();
				this.loc = wl.copy();
				this.targ = wl.copy();
				this.mx = this.my = 16;
				this.range = 7;
				this.pickwander = function(){
					do {
						this.targ = this.loc.copy().shift(Math.floor(Math.random()*10)-5,Math.floor(Math.random()*10)-5);
					} while (this.targ.dist(this.spawn)>=this.range || !Trpg.board.getTile(this.targ).getTrait("walkable"));
				}
				this.update = function(d){
					if (this.loc.dist(this.targ) > 0)// || (Math.abs(this.mx-16) > 2 || Math.abs(this.my-16) > 2))
						this.move(d);
					else if (Math.random()<.5*d)
						this.pickwander();
				}
				this.move = function(d){
					var a = Math.atan2(this.loc.dy(this.targ)*32+16-this.my,this.loc.dx(this.targ)*32+16-this.mx);
					this.mx+=Math.cos(a)*70*d;
					this.my+=Math.sin(a)*70*d;
					//if (this.loc.dist(this.targ) == 0)	return;
					var loc = this.loc.copy();
					if (this.mx < 0 || this.mx >= 32){
						loc.cx+=Math.sign(Math.cos(a));
						loc.legalize();
						if (!Trpg.board.getTile(loc).getTrait("walkable")){
							loc.cx-=Math.sign(Math.cos(a));
							loc.legalize();
							this.targ.load(loc);
							this.mx-=Math.cos(a)*70*d;
						} else {
							this.mx-=32*Math.sign(Math.cos(a));
						}
					}
					if (this.my < 0 || this.my >= 32){
						loc.cy+=Math.sign(Math.sin(a));
						loc.legalize();
						if (!Trpg.board.getTile(loc).getTrait("walkable")){
							loc.cy-=Math.sign(Math.sin(a));
							loc.legalize();
							this.targ.load(loc);
							this.my-=Math.sin(a)*70*d;
						} else {
							this.my-=32*Math.sign(Math.sin(a));
						}
					}
					loc.legalize();
					this.loc.load(loc);
					//Trpg.board.aim = this.loc;
				}
			}
			var ents = {
				Goblin:function(){
					
					return this;
				},
				Guard:function(){
					this.render = function(g){
						var x = this.mx-Trpg.board.mx+Trpg.board.cloc.dx(this.loc)*32;
						var y = this.my-Trpg.board.my+Trpg.board.cloc.dy(this.loc)*32;
						g.drawImage(Ast.i("dirt"),x,y);
					}
					return this;
				}
			}
			return ents[type].apply(new Default(wl.copy()));
		}
		//var guard = new this.Entity("Guard",new Trpg.WorldLoc(0,0,3,3));
		this.update = function(d){
			//guard.update(d);
		}
		this.render = function(g){
			//guard.render(g);
		}
	})();
	this.Structures = new (function(){
		var sectorsize = 15;
		this.centers = {
			loaded:[],
			queued:[],
			loadedstr:[],
			queuedstr:[]
		}
		this.structs = {}
		this.init = function(){
			this.triggercenter(new Trpg.WorldLoc());
		}
		this.qadjs = function(wl){
			var n = wl.copy();	n.wy-=sectorsize;
			var e = wl.copy();	e.wx+=sectorsize;
			var s = wl.copy();	s.wy+=sectorsize;
			var w = wl.copy();	w.wx-=sectorsize;
			var dirs = [n,e,s,w];
			for (var i = 0; i < dirs.length; i++){
				if (this.centers.loadedstr.indexOf(dirs[i].toStr()) == -1 &&
					this.centers.queuedstr.indexOf(dirs[i].toStr()) == -1){
					this.centers.queued.push(dirs[i]);
					this.centers.queuedstr.push(dirs[i].toStr());
				}
			}
		}
		function Structure(type,cwl) {
			function Default(cwl){
				this.cwl = cwl.copy();
				this.filled = [];
				this.allfilled = false;
				this.contchunks = [];
				this.inchunk = function(wlstr){
					for (var i = 0; i < this.contchunks.length; i++)
						if (this.contchunks[i] == wlstr)
							return true
					return false;
				}
				this.spawn = function(){
					var neighbs = Trpg.Structures.structs[this.cwl.toStr()];
					/*
				//	Math.random();
					//if (Math.random()<.8)
					//	this.layout[3]= "wssgssw_";
					//var overlap = true;
					//do {
					//for (var k = 0; overlap && k < 5; k++){
						/*var wings = (sectorsize-1)/2
						this.tlc = this.cwl.copy().tochunk();
						for (var j = -wings; j < wings; j++)//+1
							for (var i = -wings; i < wings; i++){//+1
								var overlap = false;
								for (var k = 0; k < neighbs.length; k++)
									if (neighbs[k].inchunk(this.tlc.copy().shift(8*i,8*j).toStr()))
										overlap = true;
								if (!overlap){
									this.tlc.shift(8*i,8*j);
									this.contchunks = [this.tlc.toStr()];
									return this;
								}
							}								
						return -1;
						*/
						var x = Math.floor(Math.random()*(sectorsize-this.cw))-(sectorsize-1)/2;
						var y = Math.floor(Math.random()*(sectorsize-this.ch))-(sectorsize-1)/2;
						//top left chunk
						this.tlc = this.cwl.copy().tochunk();
						this.tlc.wx+=x;
						this.tlc.wy+=y;
						this.contchunks = [];
						for (var f in this.layout){
							for (var i = 0; i < this.cw; i++)
								for (var j = 0; j < this.ch; j++)
									this.contchunks.push(this.tlc.copy().shift(8*i,8*j,f).toStr());
							for (var i = 0; i < neighbs.length; i++)
								for (var j = 0; j < this.contchunks.length; j++)
									if (neighbs[i].inchunk(this.contchunks[j]))
										return -1;
						}
					//if (this.type == "Brumlidge")
					//console.log(this.contchunks);
					return this;
				}
				this.fill = function(wl){
					if (this.filled.indexOf(wl.toStr()) !== -1)	return;
					this.filled.push(wl.toStr());
					if (this.filled.length >= this.contchunks.length) Trpg.Structures.structs[this.cwl.toStr()]
						.splice(Trpg.Structures.structs[this.cwl.toStr()].indexOf(this),1);
					
					var dx = this.tlc.dx(wl);
					var dy = this.tlc.dy(wl);
					//console.log(dx+" "+dy);
					//for (var f in this.layout){
						var f = wl.dim;
						if (!exists(this.layout[f])) return;
						//console.log(f);
						//Trpg.board.save();
						//Trpg.board.load(wl.copy().shift(0,0,f),true);
						for (var j = 0; j < 8; j++)
							for (var i = 0; i < 8; i++){
								var t = this.layout[f][j+dy][i+dx];
								if (t !== "_"){
									if (t == t.toUpperCase())
										this.special(t);
									else 
										Trpg.board.setTile(new Trpg.Tile(this.acrs[t]),wl.copy().shift(i,j,f));
								}
							}
					// }
					//Trpg.board.save();
					//Trpg.board.load(Trpg.board.cloc,true);
				}
			}
			var structs = {
				/* empty layout
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
				*/
				Forge:function(){
					this.type = "Forge";
					this.cw = 1;
					this.ch = 1;
					this.acrs = {
						w:"CastleWall",
						s:"Stone",
						g:"Grass",
						c:"CopperOre",
						t:"TinOre"
					}
					this.special = function(t){
						switch (t){
							case "1":
								var wl = this.tlc.copy().shift(3,4);
								Trpg.board.setTile(new Trpg.Tile("Portal")
									.setground("stone")
									.setdest(new Trpg.WorldLoc(-5,7,3,2)),wl);
								break;
							case "F":
								var wl = this.tlc.copy().shift(2,2);
								Trpg.board.setTile(new Trpg.Tile("Furnace")
									.setground("stone"),wl);
								break;
							case "A":
								var wl = this.tlc.copy().shift(4,2);
								Trpg.board.setTile(new Trpg.Tile("Anvil")
									.setground("stone"),wl);
								break;
							case "C":
								var wl = this.tlc.copy().shift(5,4);
								Trpg.board.setTile(new Trpg.Tile("Chest")
									.setcontents({
										items:[
											new Trpg.Item("Tinderbox").setinfinite(true),
											new Trpg.Item("Hammer").setinfinite(true),
											new Trpg.Item("Ladder").setinfinite(true),
											//new Trpg.Item("Knife").setinfinite(true),
										]})
									.setground("stone"),wl);
								break;
						}
					}
					this.layout = {
					surface:[
					"________",
					"wwwwwww_",
					"wsFsAsw_",
					"wsssssw_",
					"wss1sCw_",
					"wsssssw_",
					"wsssssw_",
					"wwgggww_"],
					underground1:[
					"___c_c__",
					"__t___t_",
					"_____c__",
					"__cc__t_",
					"________",
					"__t___t_",
					"________",
					"_c__t___"]}
					return this.spawn();
				},
				Brumlidge:function(){
					this.type = "Brumlidge";
					this.cw = 3;
					this.ch = 3;
					this.acrs = {
						w:"CastleWall",
						s:"Stone",
						g:"Grass",
					}
					this.special = function(t){
						switch (t){
							case "1":
								var wl = this.tlc.copy().shift(6,21);
								Trpg.board.setTile(new Trpg.Tile("LadderUp")
									.setground("stone")
									.setdest(wl.copy().shift(0,0,"floor1")),wl);
								break;
							case "2":
								var wl = this.tlc.copy().shift(17,21);
								Trpg.board.setTile(new Trpg.Tile("LadderUp")
									.setground("stone")
									.setdest(wl.copy().shift(0,0,"floor1")),wl);
								break;
							case "3":
								var wl = this.tlc.copy().shift(6,21);
								Trpg.board.setTile(new Trpg.Tile("LadderDown")
									.setdest(wl),wl.copy().shift(0,0,"floor1"));
								break;
							case "4":
								var wl = this.tlc.copy().shift(17,21);
								Trpg.board.setTile(new Trpg.Tile("LadderDown")
									.setdest(wl),wl.copy().shift(0,0,"floor1"));
								break;
						}
					}
					this.layout = {
						surface:[
						"__wwwwwwwwwwwwwwwwwwww__",
						"_wwssssssssssssssssssww_",
						"wwssssssssssssssssssssww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wwwwwwwwwwwsswwwwwwwwwww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwggggggggggwwssssw",
						"wsssswggggggggggggwssssw",
						"wssssgg__________ggssssw",
						"wssssgg__________ggssssw",
						"wssssgg__________ggssssw",
						"wssssgg__________ggssssw",
						"wsssswggggggggggggwssssw",
						"wsssswwggggggggggwwssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwwwsssssswwwwssssw",
						"wssssssswsssssswsssssssw",
						"wwssss1swwwggwwws2ssssww",
						"_wwssssswggggggwsssssww_",
						"__wwwwwwwggggggwwwwwww__"],
						floor1:[
						"__wwwwwwwwwwwwwwwwwwww__",
						"_wwssssssssssssssssssww_",
						"wwssssssssssssssssssssww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wwwwwwwwwwwsswwwwwwwwwww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwwwwwwwwwwwwwssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wsssswwwwwwwwwwwwwwssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwwwsssssswwwwssssw",
						"wssssssswsssssswsssssssw",
						"wwssss3swwwwwwwws4ssssww",
						"_wwsssssw______wsssssww_",
						"__wwwwwww______wwwwwww__"]}
					return this.spawn();
				}
			}
			return structs[type].apply(new Default(cwl.copy()));
		}
		this.triggercenter = function(wl){
			if (this.centers.loadedstr.indexOf(wl.toStr()) == -1){		
				this.centers.loaded.push(wl);
				this.centers.loadedstr.push(wl.toStr());
			}
			else return;
//			if (this.centers.queued.indexOf(wl) !== -1)
				this.centers.queuedstr.splice(this.centers.queuedstr.indexOf(wl.toStr()),1);
			//generate structures and init surrounding centers
			Math.seedrandom(Trpg.world.wseed+wl.toStr());
			this.structs[wl.toStr()] = [];
			if (wl.dist(new Trpg.WorldLoc())==0)
				this.structs[wl.toStr()].push(Structure("Brumlidge",wl));
			for (var i = 0; i < Math.random()*20+10; i++){
				var s =  Structure("Forge",wl); //new 
				if (s !== -1)	this.structs[wl.toStr()].push(s);
			}
			this.qadjs(wl);
		}
		this.getcenter = function(wl){
			wl = wl.copy().tochunk();
			for (var i = 0; i < this.centers.queued.length; i++)
				if (wl.dist(this.centers.queued[i]) <= 8*(sectorsize+3)/2){
					this.triggercenter(this.centers.queued[i]);
					//break;
				}
			for (var i = 0; i < this.centers.loaded.length; i++)
				if (wl.dist(this.centers.loaded[i]) <= 8*(sectorsize-1)/2)
					return this.centers.loaded[i];
			return -1;
		}
		this.checkchunk = function(wl){
			var center = this.getcenter(wl);
			if (center == -1 || !exists(this.structs[center.toStr()]))	return;
			for (var i = 0; i < this.structs[center.toStr()].length; i++)
				if (this.structs[center.toStr()][i].inchunk(wl.copy().tochunk().toStr()))
					this.structs[center.toStr()][i].fill(wl.copy());
			return false;
		}
	})();
	this.Tile = function(type,args){
		function Default(){
			this.type = "default";
			this.board = true;
			this.state = {};
			this.traits = {};
			this.getcolor = function(){	return this.avecolor || "black"}
			this.getTrait = function(trait){
				if (this.traits.hasOwnProperty(trait))
					return this.traits[trait];
				return false;
			}
			this.setState = function(loadobj,state){
				//	this = object to save state into
				//	loadobj = object to load state into
				return this; // save object
			}
			this.setground = function(ground){
				this.ground = ground;
				return this;
			}
			this.getdefground = function(wl){
				switch (wl.dim){
					case "floor2":
					case "floor1":			return "stone";
					case "surface":			return "grass";
					case "underground1":	return "stone";
				}
			}
			this.setWl = function(wl){	
				this.wl = wl;	
				if (exists(this.ground))	return this;
				return this.setground(this.getdefground(wl));
			}
			this.actions = [];
			this.getActions = function(){	return this.actions;	}
			this.hasAction = function(action){	return this.getActions().indexOf(action)!=-1;}
			this.getDelay = function(action){	return 0;	}
			this.doaction = function(action){}
			this.load = function(save){
				this.update(save.count);
				this.ground = save.ground;
			}
			this.save = function(){
				return {
					type:this.type,
					ground:this.ground,
					count:exists(this.growtimer) ? this.growtimer.count : 0
				}
			}
			this.update = function(d){}
			this.render = function(g){}
		}
		var tiles = {	
			Void:function(){
				this.type = "Void";
				this.render = function(g){
					//g.drawImage(Ast.i("grass"),0,0);
				}
				return this;
			},
			Grass:function(){
				this.type = "Grass";
				this.actions = ["dig"];
				this.avecolor = "#90D747";
				this.traits.burnable = true;
				this.traits.walkable = true;
				//this.avecolor = 
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					var wl = this.wl;
					switch (action){
						//case "wall":
						//	Trpg.board.setTile(new Trpg.Tile("CastleWall"),wl);
						//	break;
						//case "portal":
						//	Trpg.board.setTile(new Trpg.Tile("Portal"),wl);
						//	break;
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
					g.drawImage(Ast.i("grass"),0,0);
				}
				return this;
			},
			PlowedDirt:function(){
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
					g.drawImage(Ast.i("ploweddirt"),0,0);
					this.growtimer.renderp(g);
				}
				return this;
			},
			Hole:function(){
				this.type = "Hole";
				this.traits.burnable = true;
				this.traits.walkable = true;
				this.avecolor = "#90D747";
				this.actions = ["fill","plant","excavate"];
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
							var z = Trpg.Home.get("Gameplay.Board").camera.getzoom();
							if (!Trpg.invent.hasitem("Ladder")){
								//Trpg.board.container.add(new feedback("You need a ladder to go underground",
								Trpg.Home.get("Gameplay.Menus").add(new feedback("You need a ladder to go underground",
								Trpg.board.cloc.dx(wl)*32+16+Trpg.board.container.camera.x,
								Trpg.board.cloc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
								break;
							}
							var timer = new Utils.Timer(1).start().setAuto(true,function(){
								Trpg.invent.removeitem("Ladder");
								Trpg.board.setTile(new Trpg.Tile("LadderDown").setdest(wl.copy().shift(0,0,"underground1")),wl);
								Trpg.board.save();
								Trpg.board.load(wl.copy().shift(0,0,"underground1"),true)
								Trpg.board.setTile(new Trpg.Tile("LadderUp").setground("stone").setdest(wl),wl.copy().shift(0,0,"underground1"));
								Trpg.board.save();
								Trpg.board.load(Trpg.board.cloc,true);
							}).setKilloncomp(true);
							timer.board = true;
							timer.wl = wl;
							Trpg.Home.add(timer,"Gameplay.currentaction");
							break;
						case "plant":
							if (!Trpg.invent.hasitem("Seed")){
								Trpg.Home.get("Gameplay.Menus").add(new feedback("You don't have any seeds",
								Trpg.board.cloc.dx(wl)*32+16+Trpg.board.container.camera.x,
								Trpg.board.cloc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
								return;
							}
							Trpg.invent.removeitem("Seed");
							Trpg.board.setTile(new Trpg.Tile("Seedling"),wl);
							break;
					}
				}
				this.render = function(g){
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("hole"),0,0);
				}
				return this;
			},
			Portal:function(){
				this.type = "Portal";
				this.avecolor = "#0088D4";
				this.traits.walkable = true;
				this.actions = ["teleport"];
				this.setdest = function(wl){
					this.destwl = wl.copy();
					return this;
				}
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					var wl = this.wl;
					var that = this;
					switch (action){
						case "climb":
						case "teleport":
							//console.log(that);
							if (!exists(that.destwl))return;
							if (Trpg.Home.get("Gameplay").has("currentaction"))
								Trpg.Home.get("Gameplay").remove("currentaction");
							Trpg.board.save();
							Trpg.board.cloc.load(this.destwl.copy());
							Trpg.board.mx =
							Trpg.board.my = 16;
							Trpg.board.load(Trpg.board.cloc,true);
							break;
					}
				}
				this.load = function(save){
					this.ground = save.ground;
					this.destwl = new Trpg.WorldLoc().load(JSON.parse(save.dest));
				}
				this.save = function(){
					return {
						type:this.type,
						ground:this.ground,
						count:0,//exists(this.growtimer) ? this.growtimer.count : 0
						dest:JSON.stringify(this.destwl)
					}
				}
				this.render = function(g){
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("bportal"),0,0);
				}
				return this;
			},
			LadderUp:function(){
				var p = new Trpg.Tile("Portal");
				p.type = "LadderUp";
				p.avecolor = "#915E21";
				//this.traits.walkable = true;
				p.actions = ["climb"];
				/*
				//this.setdest = function(wl){
				//	this.destwl = wl.copy();
				//	return this;
				//}
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
							Trpg.board.cloc.load(newwl);
							Trpg.board.mx =
							Trpg.board.my = 16;
							Trpg.board.load(Trpg.board.cloc,true);
							break;
					}
				}*/
				p.render = function(g){
					g.drawImage(Ast.i(p.ground),0,0);
					g.drawImage(Ast.i("ladderup"),0,0);
				}
				return p;
			},
			LadderDown:function(){
				var p = new Trpg.Tile("Portal");
				p.type = "LadderDown";
				p.avecolor = "#915E21";
				//this.traits.walkable = true;
				p.actions = ["climb"];
				/*
				//this.setdest = function(wl){
				//	this.destwl = wl.copy();
				//	return this;
				//}
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
							Trpg.board.cloc.load(newwl);
							Trpg.board.mx =
							Trpg.board.my = 16;
							Trpg.board.load(Trpg.board.cloc,true);
							break;
					}
				}*/
				p.render = function(g){
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("ladderdown"),0,0);
				}
				return p;
			},
			Furnace:function(){
				this.type = "Furnace";
				this.avecolor = "#575757";
				this.actions = ["smelt"];
				this.doaction = function(action){
					if (!exists(action))
						action = this.getActions()[0];
					var wl = this.wl;
					switch (action) {
						case "smelt":
							if (!(Trpg.invent.hasitem("Tin") && Trpg.invent.hasitem("Copper"))){
								Trpg.board.container.add(new feedback("You need a some tin and copper ore",
								Trpg.board.cloc.dx(wl)*32+16+Trpg.board.container.camera.x,
								Trpg.board.cloc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
								return;
							}
							var timer = new Utils.Timer(1.3).start().setAuto(true,function(){
								if (!(Trpg.invent.hasitem("Tin") && Trpg.invent.hasitem("Copper")))
									return;
								Trpg.invent.removeitem("Tin");
								Trpg.invent.removeitem("Copper");
								Trpg.invent.additem(new Trpg.Item("BronzeBar"));
							}).setKilloncomp(true);
							timer.board = true;
							timer.wl = wl;
							Trpg.Home.add(timer,"Gameplay.currentaction");
							break;
					}
				}
				this.render = function(g){
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("furnace"),0,0);
				}
				return this;
			},
			Anvil:function(){
				this.type = "Anvil";
				this.avecolor = "#C6ABA2";
				this.actions = ["smith"];
				this.doaction = function(action){
					if (!exists(action))
						action = this.getActions()[0];
					var wl = this.wl.copy();
					switch (action) {
						case "smith":
							var z = Trpg.Home.get("Gameplay.Board").camera.getzoom();
							if (!Trpg.invent.hasitem("BronzeBar")||!Trpg.invent.hasitem("Hammer")){
								Trpg.board.container.add(new feedback("You need a hammer and some bronze bars",
								Trpg.board.cloc.dx(wl)*32+16+Trpg.board.container.camera.x,
								Trpg.board.cloc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
								break;
							}
							//console.log(Trpg.invent.getitemamt("BronzeBar"));
							var menu = new UI.DBox(0,0,135,35*Trpg.invent.getitemamt("BronzeBar"));
							menu.cropped = false;
							Trpg.Home.add(menu,"Gameplay.");
							menu.add({
								mousemove:function(e,m){
									if (!this.container.mouseonbox(m))
										this.container.removeme = true;
								},
								keydown:function(k){
									this.container.removeme = true;
								},
								update:function(){
									this.container.x = 410+Trpg.board.cloc.dx(wl)*32*z-z*Trpg.board.mx;
									this.container.y = 417+Trpg.board.cloc.dy(wl)*32*z-z*Trpg.board.my;
									if (this.container.removeme)
										this.container.container.remove(this.container);
								}
							})
							if (Trpg.invent.hasitem("BronzeBar",1))
							menu.add(new UI.Button(0,0*35,135,35).sets({text:"Dagger",onclick:function(){
								if (Trpg.invent.hasitem("BronzeBar",1))
									maketimer(smith.bind(this,"Bronze","Dagger",1),1*.7);
								menu.removeme = true;
								
							}}));
							if (Trpg.invent.hasitem("BronzeBar",2))
							menu.add(new UI.Button(0,1*35,135,35).sets({text:"Helm",onclick:function(){
								if (Trpg.invent.hasitem("BronzeBar",2))
									maketimer(smith.bind(this,"Bronze","Helm",2),2*.7);
								menu.removeme = true;
								
							}}));
							//console.log(Trpg.invent.hasitem("BronzeBar",3));
							if (Trpg.invent.hasitem("BronzeBar",3))
							menu.add(new UI.Button(0,2*35,135,35).sets({text:"Kite",onclick:function(){
								if (Trpg.invent.hasitem("BronzeBar",3))
									maketimer(smith.bind(this,"Bronze","Kite",3),3*.7);
								menu.removeme = true;
								
							}}));
							if (Trpg.invent.hasitem("BronzeBar",4))
							menu.add(new UI.Button(0,3*35,135,35).sets({text:"Legs",onclick:function(){
								if (Trpg.invent.hasitem("BronzeBar",4))
									maketimer(smith.bind(this,"Bronze","Legs",4),4*.7);
								menu.removeme = true;
								
							}}));
							if (Trpg.invent.hasitem("BronzeBar",5))
							menu.add(new UI.Button(0,4*35,135,35).sets({text:"Body",onclick:function(){
								if (Trpg.invent.hasitem("BronzeBar",5))
									maketimer(smith.bind(this,"Bronze","Body",5),5*.7);
								menu.removeme = true;
								
							}}));
							function smith(bartype, item, barsreq){
								Trpg.invent.removeitem(bartype+"Bar",barsreq);
								Trpg.invent.additem(new Trpg.Item(bartype+item));
							}
							function maketimer(infunc,delay){
								var timer = new Utils.Timer(delay).start().setAuto(true,function(){
									infunc();
									/*if (!Trpg.invent.hasitem("BronzeBar"))
										return;
									var amt ;
									for (amt = 0; amt<35; amt++)
										if (!Trpg.invent.hasitem("BronzeBar",amt)){
											amt--;
											break;
										}
									var item;
									switch (amt){
										case 1:		item = new Trpg.Item("BronzeDagger");	break;
										case 2:		item = new Trpg.Item("BronzeHelm");		break;
										case 3:		item = new Trpg.Item("BronzeKite");		break;
										case 4:		item = new Trpg.Item("BronzeLegs");		break;
										default:	amt = 5;
										case 5:		item = new Trpg.Item("BronzeBody");		break;
									}
									for (var i = 0; i < amt; i++)
										Trpg.invent.removeitem("BronzeBar");
									Trpg.invent.additem(item);*/
								}).setKilloncomp(true);
								timer.board = true;
								timer.wl = wl;
								Trpg.Home.add(timer,"Gameplay.currentaction");
							}
							/*var timer = new Utils.Timer(2).start().setAuto(true,function(){
								if (!Trpg.invent.hasitem("BronzeBar"))
									return;
								var amt ;
								for (amt = 0; amt<35; amt++)
									if (!Trpg.invent.hasitem("BronzeBar",amt)){
										amt--;
										break;
									}
								var item;
								switch (amt){
									case 1:		item = new Trpg.Item("BronzeDagger");	break;
									case 2:		item = new Trpg.Item("BronzeHelm");		break;
									case 3:		item = new Trpg.Item("BronzeKite");		break;
									case 4:		item = new Trpg.Item("BronzeLegs");		break;
									default:	amt = 5;
									case 5:		item = new Trpg.Item("BronzeBody");		break;
								}
								for (var i = 0; i < amt; i++)
									Trpg.invent.removeitem("BronzeBar");
								Trpg.invent.additem(item);
							}).setKilloncomp(true);
							timer.board = true;
							timer.wl = wl;
							Trpg.Home.add(timer,"Gameplay.currentaction");*/
							break;
					}
				}
				this.render = function(g){
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("anvil"),0,0);
				}
				return this;
			},
			Seedling:function(){
				this.type = "Seedling";
				this.avecolor = "#90D747";
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("seedling"),0,0);
					this.growtimer.renderp(g);
				}
				return this;
			},
			DeadSeedling:function(){
				this.type = "DeadSeedling";
				this.actions = ["dig"];
				this.avecolor = "#90D747";
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("deadseedling"),0,0);
					//this.growtimer.render(g);
				}
				return this;
			},
			Sapling:function(){
				this.type = "Sapling";
				this.avecolor = "#2D6118";
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("sapling"),0,0);
					this.growtimer.renderp(g);
				}
				return this;
			},
			Tree:function(){
				this.type = "Tree";
				var hasseed = Math.random()<.3;
				this.actions = ["chop","search"];
				this.avecolor = "#2D6118";
				this.doaction = function(action){
					if (!exists(action))
						action = this.getActions()[0];
					var wl = this.wl;
					switch (action) {
						case "chop":
							var timer = new Utils.Timer(1.2).start().setAuto(true,function(){
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
									Trpg.board.container.add(new feedback("You find a seed",
									Trpg.board.cloc.dx(wl)*32+16+Trpg.board.container.camera.x,
									Trpg.board.cloc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("tree"),0,0);
					//console.log(Ast.i("tree"));
					//this.growtimer.render(g);
				}
				return this;
			},
			FireBig:function(){
				this.type = "FireBig";
				var that = this;
				this.avecolor = "#90D747";
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("firebig"),0,0);
					this.growtimer.renderp(g);
				}
				return this;
			},
			FireSmall:function(){
				this.type = "FireSmall";
				var that = this;
				this.avecolor = "#90D747";
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
					var wl = this.wl.copy();
					switch (action) {
						case "fuel":
							//var timer = new Utils.Timer(1).start().setAuto(true,function
							/*	Trpg.board.container.add(new feedback("You add a log to the fire",
								Trpg.board.cloc.dx(wl)*32+16+Trpg.board.container.camera.x,
								Trpg.board.cloc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");*/
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("firesmall"),0,0);
					this.growtimer.renderp(g);
				}
				return this;
			},
			Stump:function(){
				this.type = "Stump";
				this.avecolor = "#90D747";
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
					g.drawImage(Ast.i(this.ground),0,0);
					g.drawImage(Ast.i("stump"),0,0);
					//this.growtimer.render(g);
				}
				return this;
			},
			CastleWall:function(){
				this.type = "CastleWall";
				this.avecolor = "#6F6F6F";
				this.render = function(g){
					var adjs = 
					(Trpg.board.getTile(this.wl.copy().shift(0,-1)).type == "CastleWall" ? "1" : "0")+
					(Trpg.board.getTile(this.wl.copy().shift(1,0)).type == "CastleWall" ? "1" : "0")+
					(Trpg.board.getTile(this.wl.copy().shift(0,1)).type == "CastleWall" ? "1" : "0")+
					(Trpg.board.getTile(this.wl.copy().shift(-1,0)).type == "CastleWall" ? "1" : "0");
					g.drawImage(Ast.i(this.ground),0,0);
					g.save();
					g.translate(16,16);
					switch (adjs){
						case "0000":	g.drawImage(Ast.i("cwallc"),-16,-16);	break;
						case "1111":	g.drawImage(Ast.i("cwallx"),-16,-16);	break;
						case "0001":	g.rotate(Math.PI/2);
						case "0010":	g.rotate(Math.PI/2);
						case "0100":	g.rotate(Math.PI/2);
						case "1000":	g.drawImage(Ast.i("cwallu"),-16,-16);	break;
						case "1001":	g.rotate(Math.PI/2);
						case "0011":	g.rotate(Math.PI/2);
						case "0110":	g.rotate(Math.PI/2);
						case "1100":	g.drawImage(Ast.i("cwalll"),-16,-16);	break;
						case "0101":	g.rotate(Math.PI/2);
						case "1010":	g.drawImage(Ast.i("cwallv"),-16,-16);	break;
						case "1110":	g.rotate(Math.PI/2);
						case "1101":	g.rotate(Math.PI/2);
						case "1011":	g.rotate(Math.PI/2);
						case "0111":	g.drawImage(Ast.i("cwallt"),-16,-16);	break;
					}
					g.restore();
				}
				return this;
			},
			Chest:function(){
				this.type = "Chest";
				this.avecolor = "#000000";
				this.actions = ["open"];
				this.traits.walkable = true;
				this.setinfinite = function(inf){
					this.infinite = inf;
					return this;
				}
				this.setcontents = function(contents){
					this.contents = contents;
					this.empty = false;
					return this;
				}
				this.newcontents = function(){
					var items = [];
					for (var i = 0; i < Math.random()*2+1; i++)
						(function(){
							var rng = Math.random();
							//if (rng<.05)
							//	items.push(new Trpg.Item("Gold").setamt(Math.random()*500+500));
							//else if (rng < .4)
							//	items.push(new Trpg.Item("Gold").setamt(Math.random()*50));
							//else 
								if (rng < .4)
								items.push(new Trpg.Item("Bronze"+(["Dagger","Helm","Kite","Legs","Body"][Math.floor(Math.random()*5)])));
							else if (rng < .7)
								for (var j = 0; j < Math.random()*4; j++)
									items.push(new Trpg.Item("BronzeBar"));
							else
								for (var j = 0; j < Math.random()*3; j++)	
									items.push(new Trpg.Item(["Tin","Copper"][Math.floor(Math.random()*2)]));
							/*else 
								for (var j)
							else if (rng < .8)
								for (var j = 0; j < Math.random()*3; j++)	items.push(new Trpg.Item("Tin"));
							else 
								for (var j = 0; j < Math.random()*3; j++)	items.push(new Trpg.Item("Copper"));
								*/
						})();
					this.empty = false;
					this.contents = {
						items:items
					};
				}
				this.empty = true;
				this.newcontents();
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					var wl = this.wl;
					var that = this;
					switch (action){
						case "open":
							if (this.empty)	return;
							var timer = new Utils.Timer(.3).start().setAuto(true,function(){
								var items = that.contents.items;
								var z = Trpg.Home.get("Gameplay.Board").camera.getzoom();
								var menu = new UI.DBox(
									410+Trpg.board.cloc.dx(wl)*32*z-z*Trpg.board.mx,
									410+Trpg.board.cloc.dy(wl)*32*z-z*Trpg.board.my,135,0);
								Trpg.Home.add(menu,"Gameplay.");
								menu.add({
									mousemove:function(e,m){
										if (!this.container.mouseonbox(m))
											this.container.removeme = true;
									},
									keydown:function(k){
										this.container.removeme = true;
									},
									update:function(){
										this.container.x = 410+Trpg.board.cloc.dx(wl)*32*z-z*Trpg.board.mx;
										this.container.y = 410+Trpg.board.cloc.dy(wl)*32*z-z*Trpg.board.my;
										if (this.container.removeme)
											this.container.container.remove(this.container);
									}
								})
								/*if (items.length > 1){
									var btn = new UI.Button(0,0,135,35);
									menu.h+=35;
									btn.color = "orange";
									btn.text = "Take All";
									btn.onclick = function(){
										var es = Trpg.invent.getempty();
										var l = items.length;
										for (var i = 0; i < es && i < l; i++)
											Trpg.invent.additem(items.splice(0,1)[0]);
										menu.container.remove(menu);
										return true;
									}
									menu.add(btn);
								}*/
								for (var i = 0; i < items.length; i++){
									var btn = new UI.Button(0,menu.h,135,35);
									menu.h+=35;
									btn.color = "orange";
									btn.text = items[i].type;
									btn.i = i;
									btn.item = items[i].copy();
									btn.onclick = function(){
										Trpg.invent.additem(this.item.copy().setinfinite(false));
										if (!this.item.infinite){
											items.splice(items.indexOf(this.item),1);
											menu.remove(this);
										} else return true;
										if (items.length == 0){
											menu.container.remove(menu);
											that.empty = true;
											//return true;
										} else {
											var q = menu.getq();
											for (var p in q){
												if (exists(q[p].systemname) && 
													q[p].systemname.indexOf("item")!==-1 && 
													parseInt(q[p].systemname.substring(4)) >= this.i)
														q[p].y-=35;
											}
										}
										return true;
									}
									menu.add(btn,"item"+i);
								}
								/*for (var i = 0; i < that.contents.items.length; i++)
									if (Trpg.invent.getempty()>0)
										Trpg.invent.additem(that.contents.items[i]);
									else
										Trpg.board.ground.dropitem(that.contents.items[i],wl);
								that.opened = true;*/
							}).setKilloncomp(true);
							timer.board = true;
							timer.wl = wl;
							Trpg.Home.add(timer,"Gameplay.currentaction");
							/*
							var menu = new UI.DBox(0,0,135,35*Trpg.invent.getitemamt("BronzeBar"));
							menu.cropped = false;
							Trpg.Home.add(menu,"Gameplay.");
							menu.add({
								mousemove:function(e,m){
									if (!this.container.mouseonbox(m))
										this.container.removeme = true;
								},
								keydown:function(k){
									this.container.removeme = true;
								},
								update:function(){
									this.container.x = 410+Trpg.board.cloc.dx(wl)*32*z-z*Trpg.board.mx;
									this.container.y = 417+Trpg.board.cloc.dy(wl)*32*z-z*Trpg.board.my;
									if (this.container.removeme)
										this.container.container.remove(this.container);
								}
							})
							for (var i = 0; i < this.contents.items.length; i++){
								var item = this.contents.items[i];
								menu.add(new UI.Button(0,i*35,135,35).sets({
									inrender:function(g){
										
									},onclick:function(){
										if (Trpg.invent.hasitem("BronzeBar",1))
											maketimer(smith.bind(this,"Bronze","Dagger",1),1*.7);
										menu.removeme = true;
									}}));
							}
							
							
							*/
							break;
					}
				}
				this.load = function(save){
					this.ground = save.ground;
					var items = [];
					var contents = JSON.parse(save.contents);
					for (var i = 0; i < contents.items.length; i++)
						items.push(new Trpg.Item(contents.items[i].type).setinfinite(contents.items[i].infinite));
					this.setcontents({items:items});
					this.empty = JSON.parse(save.empty);
					//new Trpg.WorldLoc().load(JSON.parse(save.dest));
				}
				this.save = function(){
					return {
						type:this.type,
						ground:this.ground,
						contents:JSON.stringify(this.contents),
						count:0,//exists(this.growtimer) ? this.growtimer.count : 0
						empty:JSON.stringify(this.empty)
					}
				}
				this.render = function(g){
					g.fillStyle = "yellow";
					g.drawImage(Ast.i(this.ground),0,0);
					var text = this.empty ? "Empty" : "Chest";
					Drw.drawCText(g,text,16,16);
					//g.fillText("Chest",)
					//g.drawImage(Ast.i("dirt"),0,0);
				}
				return this;
			},
			Dirt:function(){
				this.type = "Dirt";
				this.avecolor = "#663B16";
				this.actions = ["dig"];
				//if (Math.random() < .01) return new Trpg.Tile("Chest");
				//else return new Trpg.Tile("StoneFloor");
				this.chest = Math.random() < .05 ? new Trpg.Tile("Chest") : -1;
				//this.traits.burnable = true;
				//this.traits.walkable = true;
				var that = this;
				this.forcetimer = new Utils.Timer(.3).setAuto(true,function(){
								if (that.chest !== -1)
									Trpg.board.setTile(that.chest,that.wl);
								else 
									Trpg.board.setTile(new Trpg.Tile("Stone"),that.wl);
							});
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					var wl = this.wl;
					switch (action){
						case "walkon":
							this.forcing = true;
							if (!this.forcetimer.running)
								this.forcetimer.start();
							break;
						case "dig":
							if (!(Trpg.board.getTile(wl.copy().shift(0,1)).traits.walkable
							  ||Trpg.board.getTile(wl.copy().shift(0,-1)).traits.walkable
							  ||Trpg.board.getTile(wl.copy().shift(1,0)).traits.walkable
							  ||Trpg.board.getTile(wl.copy().shift(-1,0)).traits.walkable))
							  break;
						if (Trpg.Home.get("Gameplay").has("currentaction")) return;
							var timer = new Utils.Timer(.3).start().setAuto(true,function(){
								if (that.chest !== -1)
									Trpg.board.setTile(that.chest,wl);
								else 
									Trpg.board.setTile(new Trpg.Tile("Stone"),wl);
							}).setKilloncomp(true);
							timer.board = true;
							timer.wl = wl;
							Trpg.Home.add(timer,"Gameplay.currentaction");
							break;
					}
				}
				this.update = function(d){
					if (this.forcing)	this.forcetimer.update(d);
					else this.forcetimer.count = 0;
					this.forcing = false;
					
				}
				this.render = function(g){
					g.drawImage(Ast.i("dirt"),0,0);
					this.forcetimer.renderp(g);
				}
				return this;
			},
			Floor:function(type){
				this.type = type;
				this.avecolor = "#8A8A8A";
				this.traits.walkable = true;
				this.render = function(g){
					g.drawImage(Ast.i(this.type.toLowerCase()),0,0);
				}
				return this;
			},
			Stone:function(){
				return tiles.Floor.call(this,"Stone");
			},
			//{ores
			Ore:function(type,avecol){
				this.type = type+"Ore";
				this.actions = ["dig"];
				this.avecolor = avecol;
				this.item = type;
				switch (type){
					case "Tin":
					case "Copper":	this.digrate = 1;	break;
					case "Iron":	this.digrate = 2;	break;
					case "Mithril":	this.digrate = 3;	break;
					case "Adamant":	this.digrate = 5;	break;
					case "Runite":	this.digrate = 8;	break;
					case "Eternium":this.digrate = 20;	break;
				}
				this.getdefground = function(wl){
					switch (wl.dim){
						case "underground1":	return "dirt";
						case "underground1":	return "dirt";
						case "underground1":	return "dirt";
						case "underground1":	return "dirt";
					}
				}
				var that = this;
				this.forcetimer = new Utils.Timer(this.digrate).setAuto(true,function(){
								Trpg.board.setTile(new Trpg.Tile("Stone"),that.wl);
								Trpg.invent.additem(new Trpg.Item(that.item));
							});
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					var wl = this.wl;
					var that = this;
					switch (action){
						case "walkon":
							this.forcing = true;
							if (!this.forcetimer.running)
								this.forcetimer.start();
							break;
						case "dig":
							var adjs = wl.getadjs();
							var reachable = false;
							for (var i = 0; i < adjs.length; i++)
								if (Trpg.board.getTile(adjs[i]).traits.walkable)
									reachable = true;
							if (!reachable)	break;
							var timer = new Utils.Timer(that.digrate).start().setAuto(true,function(){
								switch(wl.dim){
									case "underground1":	Trpg.board.setTile(new Trpg.Tile("Stone").sets({traits:{walkable:true}}),wl);	break;
									//case "underground1":	Trpg.board.setTile(new Trpg.Tile("StoneFloor"),wl);	break;
								}
								Trpg.invent.additem(new Trpg.Item(that.item));
							}).setKilloncomp(true);
							timer.board = true;
							timer.wl = wl;
							Trpg.Home.add(timer,"Gameplay.currentaction");
							break;
					}
				}
				this.update = function(d){
					if (this.forcing)	this.forcetimer.update(d);
					else this.forcetimer.count = 0;
					this.forcing = false;
					
				}
				this.render = function(g){
					g.drawImage(Ast.i(this.ground),0,0);
					//g.drawImage(Ast.i("eternium"+"ore"),0,0);
					g.drawImage(Ast.i(this.item.toLowerCase()+"ore"),0,0);
					this.forcetimer.renderp(g);
				}
				return this;
			},
			TinOre:function(){		return tiles.Ore.call(this,"Tin","#808080");		},
			CopperOre:function(){	return tiles.Ore.call(this,"Copper","#C57339");	},
			CoalOre:function(){		return tiles.Ore.call(this,"Coal","#4B4B4B");		},
			IronOre:function(){		return tiles.Ore.call(this,"Iron","#954C33");		},
			MithrilOre:function(){	return tiles.Ore.call(this,"Mithril","#000000");	},
			AdamantOre:function(){	return tiles.Ore.call(this,"Adamant","#000000");	},
			RuniteOre:function(){	return tiles.Ore.call(this,"Runite","#000000");	},
			EterniumOre:function(){	return tiles.Ore.call(this,"Eternium","#CAE4B7");	},//}
		}
		return tiles[type].apply(new Default());
	}
	this.Chunk = function(x,y,d){
		this.wl = new Trpg.WorldLoc(x,y,0,0,d);
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
								if (Math.random()<.1)
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
				case "floor1":
				case "floor2":
					for (var i = 0; i < 8; i++){
						var row = [];
						var orow = [];
						for (var j = 0; j < 8; j++){
							var t = new Trpg.Tile("Void").setWl(this.wl.copy().shift(j,i));
							//var t = generateTile(Math.random()).setWl(this.wl.copy().shift(j,i));
							row.push(t);
							orow.push(t);
						}
						this.tiles.push(row);
						this.origtiles.push(orow);
					}
					break;
				case "underground1":
				case "underground2":
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
					if (Math.random()<.3){
						var type = (function(){if (Math.random()<.5)return "TinOre";return "CopperOre"})()
						var amt = Math.floor(Math.random()*5+5);
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
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					Trpg.Map.addtile(this.tiles[j][i]);
			return this;
		}
		this.renderimg = function(g){
			var s = 3;
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++){
					g.fillStyle = this.tiles[j][i].getcolor();
					g.fillRect(s*i,s*j,s,s);
				}
		}
		this.getimg = function(){
			var c=document.createElement("canvas");
			var ctx=c.getContext("2d");
			//var imgData=ctx.createImageData(8,8);
			//for (var i=0;i<imgData.data.length;i+=4)
			//	{
			//	imgData.data[i+0]=255;
			//	imgData.data[i+1]=0;
			//	imgData.data[i+2]=0;
			//	imgData.data[i+3]=255;
			//	}
			//ctx.putImageData(imgData,10,10);
			return ctx;
		}
		this.getTile = function(wl){
			return this.tiles[wl.cy][wl.cx];
		}
		this.setTile = function(tile, wl){
			this.tiles[wl.cy][wl.cx] = tile.setWl(wl.copy());
			Trpg.Map.addtile(tile);
		}
		this.loadChanges = function(){
			var changes = JSON.parse(Trpg.world.changes[this.code]);
			for (var i = 0; i < changes.length; i++){
				this.tiles[changes[i].i][changes[i].j] = new Trpg.Tile(changes[i].save.type).setWl(this.wl.copy().shift(changes[i].j,changes[i].i));
				this.tiles[changes[i].i][changes[i].j].load(changes[i].save);
				Trpg.Map.addtile(this.tiles[changes[i].i][changes[i].j]);
				//this.tiles[changes[i].i][changes[i].j].update(changes[i].count);
			}
		}
		this.getChanges = function(){
			var changes = [];
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					if (this.tiles[i][j].type!=this.origtiles[i][j].type)
						changes.push({i:i,j:j,save:this.tiles[i][j].save()})
						//if (exists(this.tiles[i][j].growtimer))
						//	 changes.push({i:i,j:j,type:this.tiles[i][j].type,count:this.tiles[i][j].growtimer.count});
						//else changes.push({i:i,j:j,type:this.tiles[i][j].type,count:0});
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
			g.translate(32*(8*x-0*Trpg.board.cloc.cx),32*8*y);
			for (var i = 0, wl; i < 8; i++){
				for (var j = 0; j < 8; j++){
					wl = new Trpg.WorldLoc(x,y,j,i,d);
					
					if (Trpg.board.cloc.dist(wl) < Trpg.board.viewsize)
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