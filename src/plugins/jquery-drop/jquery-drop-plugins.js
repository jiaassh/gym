// 插件
$.fn.extend({
	//---元素拖动插件
	dragging: function(data) {
		var $this = $(this);
		var xPage;
		var yPage;
		var X; //
		var Y; //
		var xRand = 0; //
		var yRand = 0; //
		var father = $this.parent();
		var defaults = {
			move: 'both',
			randomPosition: true,
			hander: 1
		}
		var opt = $.extend({}, defaults, data);
		var movePosition = opt.move;
		var random = opt.randomPosition;

		var hander = opt.hander;

		if (hander == 1) {
			hander = $this;
		} else {
			hander = $this.find(opt.hander);
		}


		//---初始化
		father.css({
			"position": "relative",
			"overflow": "hidden"
		});
		$this.css({
			"position": "absolute"
		});
		hander.css({
			"cursor": "move"
		});
		
	

		var faWidth = father.width();
		var faHeight = father.height();
		var thisWidth = $this.width() + parseInt($this.css('padding-left')) + parseInt($this.css('padding-right'));
		var thisHeight = $this.height() + parseInt($this.css('padding-top')) + parseInt($this.css('padding-bottom'));


		var mDown = false; //
		var positionX;
		var positionY;
		var moveX;
		var moveY;

		// compute
		let $_parent = $($this[0]);
		let _id = $_parent.data('id');
		let _changeWidth;
		let _changeHeight;

		let _config = {}

		if (random) {
			$thisRandom();
		}

		function $thisRandom() { //随机函数
			$this.each(function(index) {
				var randY = parseInt(Math.random() * (faHeight - thisHeight)); ///
				var randX = parseInt(Math.random() * (faWidth - thisWidth)); ///
				if (movePosition.toLowerCase() == 'x') {
					$(this).css({
						left: randX
					});
				} else if (movePosition.toLowerCase() == 'y') {
					$(this).css({
						top: randY
					});
				} else if (movePosition.toLowerCase() == 'both') {
					$(this).css({
						top: randY,
						left: randX
					});
				}

			});
		}

		hander.mousedown(function(e) {
			father.children().css({
				"zIndex": "0"
			});
			$this.css({
				"zIndex": "1"
			});
			mDown = true;
			X = e.pageX;
			Y = e.pageY;
			positionX = $this.position().left;
			positionY = $this.position().top;
			return false;
		});

		$(document).mouseup(function(e) {
			mDown = false;
		});

		$(document).mousemove(function(e) {
			xPage = e.pageX; //--
			moveX = positionX + xPage - X;

			yPage = e.pageY; //--
			moveY = positionY + yPage - Y;

			function thisXMove() { //x轴移动
				if (mDown == true) {
					$this.css({
						"left": moveX
					});
				} else {
					return;
				}
				if (moveX < 0) {
					$this.css({
						"left": "0"
					});
				}
				if (moveX > (faWidth - thisWidth)) {
					$this.css({
						"left": faWidth - thisWidth
					});
				}
				return moveX;
			}

			function thisYMove() { //y轴移动
				if (mDown == true) {
					$this.css({
						"top": moveY
					});
				} else {
					return;
				}
				if (moveY < 0) {
					$this.css({
						"top": "0"
					});
				}
				if (moveY > (faHeight - thisHeight)) {
					$this.css({
						"top": faHeight - thisHeight
					});
				}
				return moveY;
			}


			function thisAllMove(){ //全部移动
				if(mDown == true){
					_config.left = moveX;
					_config.top = moveY;
					$this.css({"left":moveX,"top":moveY});
				}else{
					return;
				}
				if(moveX < 0){
					_config.left = 0
					$this.css({"left":"0"});
				}
				if(moveX > (faWidth-thisWidth)){
					_config.left = faWidth-thisWidth
					$this.css({"left":faWidth-thisWidth});
				}
				if(moveX == faWidth){
					console.log('到达边界');
				}
						
				if(moveY < 0){
					_config.top = 0
					$this.css({"top":"0"});
				}
				if(moveY > (faHeight-thisHeight)){
					_config.top = faHeight-thisHeight
					$this.css({"top":faHeight-thisHeight});
				}
				$this.attr('data-left',_config.left).attr('data-top',_config.top)
			}



			if (movePosition.toLowerCase() == "x") {
				thisXMove();
			} else if (movePosition.toLowerCase() == "y") {
				thisYMove();
			} else if (movePosition.toLowerCase() == 'both') {
				thisAllMove();
			}
		});
	}
});
