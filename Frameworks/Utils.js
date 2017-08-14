function UtilsFramework(){
	this.frameworkName = "UtilsFramework";
	var that = this;
	this.Listener = function(func, oncomp){
		this.condition = func || function(){return true;}
		this.oncomp = oncomp || function(){}
		this.update = function(){
			if (this.condition())
				if (this.oncomp())
					this.container.remove(this);
		}
	}
	this.KeyListener = function(type, key, oncomp){
		oncomp = oncomp || function(){};
		this.init = function(){
			if (!(type == "down" || type == "up")){
				this.container.remove(this);
				return;
			}
			this["key"+type] = function(k){
				if (k.key == key){
					if (oncomp())
						this.container.remove(this);
				}
			}
		}
	}
	this.MouseListener = function(type, func, oncomp){
		oncomp = oncomp || function(){};
		this.init = function(){
			if (["down","up","move"].indexOf(type)==-1){
				this.container.remove(this);
				return;
			}
			this["mouse"+type] = function(e,m){
				if (func(e,m))
					if (oncomp())
						this.container.remove(this);
			}
		}
	}
	this.TimedSequence = function(seq){
		this.seq = seq;
		this.timer = new that.Timer(this.seq[0].c).start();
		this.update = function(delta){
			this.timer.update(delta);
			if (this.seq[0] == undefined){
				this.container.remove(this);
				return;
			}
			if (typeof this.seq[0].c != "number" || typeof this.seq[0].e != "function"){
				if (this.seq.shift() == undefined)
					this.container.remove(this);
				return;
			}
			if (this.timer.consume())
			//if (this.seq[0].c())
				this.advance();
		}
		this.advance = function(){
			this.seq[0].e();
			if (this.seq.shift() == undefined)
				this.container.remove(this);
			if (this.seq[0] == undefined){
				this.container.remove(this);
				return;
			}
			this.timer = new that.Timer(this.seq[0].c).start();
		}
	}
	this.Sequence = function(seq){
		this.seq = seq;
		this.update = function(){
			if (this.seq[0] == undefined && exists(this.container.remove)){
				this.container.remove(this);
				return;
			}
			if (typeof this.seq[0].c != "function" || typeof this.seq[0].e != "function"){
				if (this.seq.shift() == undefined && exists(this.container.remove))
					this.container.remove(this);
				return;
			}
			if (this.seq[0].c())
				this.advance();
		}
		this.skip = function(){
			if (this.seq.shift() == undefined && exists(this.container.remove))
				this.container.remove(this);
		}
		this.advance = function(){
			if (exists(this.seq[0]))
				this.seq[0].e();
			if (this.seq.shift() == undefined && exists(this.container.remove))
				this.container.remove(this);
		}
	}
	this.Repeater = function(reps){
		this.maxreps = reps || -1;
		this.curreps = 0;
		this.timer = new that.Timer(1).setLoop(true).start();
		this.oncomp = function(){}
		this.onfinish = function(){}
		this.setOncomp = function(oncomp){
			this.oncomp = oncomp || function(){};
			return this;
		}
		this.setOnfinish = function(onfinish){
			this.onfinish = onfinish || function(){};
			return this;
		}
		this.progress = function(){
			if (this.maxreps == -1)
				return 0;
			return this.curreps / this.maxreps;
		}
		this.setDelay = function(delay){
			this.timer = new that.Timer(delay || 1).setLoop(true).start();
			return this;
		}
		this.update = function(delta){
			this.timer.update(delta);
			if (this.curreps >= this.maxreps && this.maxreps != -1){
				this.onfinish();
				this.container.remove(this);
				return;
			}
			if (this.timer.consume()){
				this.curreps++;
				this.oncomp();
			}
		}
	}
	this.Timer = function(dur){
		this.dur = dur || 0;
		this.count = 0;
		this.running = false;
		this.loop = false;
		this.autocons = false;
		this.setKilloncomp = function(kill){
			this.killoncomp = kill || false;
			return this;
		}
		this.setLoop = function(loop){
			this.loop = loop || false;
			return this;
		}
		this.setAuto = function(auto, oncomp){
			this.autocons = auto;
			if (typeof oncomp == "function")
				this.oncomp = oncomp;
			return this;
		}
		this.start = function(finished){
			this.count = 0;
			if (finished)
				this.count = this.dur;
			this.running = true;
			return this;
		}
		this.ready = function(){
			return this.count >= this.dur;
		}
		this.progress = function(){
			if (this.count >= this.dur)
				return 1;
			return this.count/this.dur;
		}
		this.consume = function(){
			if (this.dur < 0)
				return false;
			if (this.count >= this.dur){
				this.count = 0;
				if (!this.loop)
					this.running = false;
				return true;
			}
			return false;
		}
		this.renderp = function(g){
			if (this.progress()>=1||this.progress()<0)
				return; else{
				g.save();
				g.globalAlpha = .35;
				g.fillStyle = "white";
				g.beginPath();
				g.lineTo(16,16);
				g.arc(16,16,8,-Math.PI/2,2*Math.PI*(-.25+this.progress()));
				g.fill();
				g.restore();
			}
		}
		this.update = function(delta){
			//console.log(this.count);
			if (this.running && this.count <= this.dur)
				this.count+=delta;
			if (this.autocons)
				if (this.consume())
					if (typeof this.oncomp == "function"){
						this.oncomp();
						if (this.killoncomp) 
							this.container.remove(this);
					}
		}
	}
}