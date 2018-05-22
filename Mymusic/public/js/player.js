;(function($){
	
	var fnName = 'audioPlay';
	var config = {
		box  : ".audio-box",

		view : ".audio-view",

		title : ".audio-title",

		cover : ".audio-cover",

		autoPlay : false,

		volume : {

			volumeView : ".audio-set-volume",
			volumeBox : ".volume-box",
		},

		timeView : {

			thisTime : ".audio-this-time",

			countTime : '.audio-count-time',
		},

		setbacks : {

			setbacks : '.audio-setbacks',

			thisSetbacks : '.audio-this-setbacks',

			cacheSetbacks : ".audio-cache-setbacks",

			volumeSetbacks : ".volume-box > i",

			volumeCircular : ".volume-box > i span"
		},
			
		button : {

			volume : ".audio-volume",

			backs : ".audio-backs-btn",

			prev : ".audio-prev",

			play : ".audio-play",

			next : ".audio-next",

			menu : ".audio-menu",

			menuClose : ".menu-close",
			delete:'.audio-delete'
		},

		menu : {

			menuView : '.audio-list',

			colse : '.close',

			list : '.audio-inline'
		},

		song : null
		// played:false
	};

	var volumeSize = 0.8;
	var songEq = 0;


	window[fnName] = function(setConfig){

		//设置属性值
		if(typeof(setConfig) == "object"){

			for( var n in setConfig){

				config[n] = setConfig[n];
			}
		}

		var _this = config,
			playDate;
		var cover = $(_this.cover),
			title = $(_this.title),
			thisTime = $(_this.timeView.thisTime),
			countTime = $(_this.timeView.countTime),
			thisSetbacks = $(_this.setbacks.thisSetbacks),
			cacheSetbacks = $(_this.setbacks.cacheSetbacks),
			setbacks = $(_this.setbacks.setbacks),
			volumeCircular = $(_this.setbacks.volumeCircular),
			volumeSetbacks = $(_this.setbacks.volumeSetbacks),
			volumeBox = $(_this.volume.volumeBox),
			volumeView = $(_this.volume.volumeView),
			play = $(_this.button.play),
			prev = $(_this.button.prev),
			next = $(_this.button.next),
			menuBtn = $(_this.button.menu),
			volume = $(_this.button.volume),
			menuClose = $(_this.button.menuClose),
			backs = $(_this.button.backs),
			box = $(_this.box),
			menuView = $(_this.menu.menuView),
			deleteBtn = $(_this.button.delete);

		_this.createAudio = function(){

			if(!_this.audio){

				_this.audio = new Audio();
			}

			var song = config.song;
			if(!song || song.lenght == 0){

				// alert('当前歌单没有歌曲!!!');
				return false;
			}else{
				_this.audio.src = song[songEq].src;

			}

			_this.stopAudio();
			
			_this.volumeSet();

			title.text(song[songEq].title || '未知歌曲');
			cover.css({
				'backgroundImage' : 'url('+(song[songEq].cover || '')+')'
			});
			function setDuration(){
				if(isNaN(_this.audio.duration)){

					setTimeout(setDuration,50);
				}else{

					countTime.text(_this.conversion(_this.audio.duration));
				}
			}
			setDuration(_this.audio.duration);
			
			thisTime.text(_this.conversion(_this.audio.currentTime));


			_this.audio.onended = function(){

				setTimeout(function(){
					// 
					++songEq;
					songEq = (songEq < _this.song.length) ? songEq : 0;
					_this.selectMenu(songEq,true);
				},1000);
			}

		}

		var timeAudio;
		_this.playAudio = function(){
			var song = _this.song;
			if(song !== null){

			}
			if(_this.audio){
				
				if(!playDate || (Date.now() - playDate) > 100){

					playDate = Date.now();

					(!_this.audio.paused) || _this.audio.pause();

					_this.audio.play();
					play.addClass('audio-stop').one('click',function(){
						if(song.length > 0){
							$("#contr").addClass('pause-needle');
							$("#contr").removeClass('resume-needle');
							setTimeout(function(){
								
								$(".img").css({
									"animation-play-state":"paused"
								});
							},500);
						_this.stopAudio();
						}
						
						$(this).removeClass('audio-stop').one('click',function(){
							if(song.length > 0){
								$("#contr").addClass('resume-needle');
								$("#contr").removeClass('pause-needle');
								setTimeout(function(){
									$(".img").css({
										"animation-play-state":"running"
									});
								},500);
								_this.playAudio();
							}
						


							
						});
					});
					var played = 0;
					
					timeAudio = setInterval(function(){

						if(_this.audio.readyState == 4){

							cacheSetbacks.css({
								'width' : (_this.audio.buffered.end(0) / _this.audio.duration)*100+"%"
							});
						}
						
						thisSetbacks.css({

							'width' : (_this.audio.currentTime / _this.audio.duration)*100+"%"
						});
						
						thisTime.text(_this.conversion(_this.audio.currentTime));
					},500);
				}else{

					setTimeout(function(){

						_this.playAudio();
					},50);
				}			
			}
			saveMusic();
			var played = false;
			function saveMusic(){
				
				//记录用户播放过的歌曲
				if(played == false){
					setTimeout(function(){
						console.log(_this.song[songEq].id);
						var id = _this.song[songEq].id;
						var singer = _this.song[songEq].singer;
						console.log(singer);
						var data = {id:id,singer:singer};
						
						$.ajax({
							type:"POST",
							url:'/user/history',
							data:data,
							success:function(a){
								console.log(a);
							}
						});
						played = true;
						
					},10000);

					

				}else{
					
				}
				
			}
		}

		
		_this.stopAudio = function(){

			if(!playDate || (Date.now() - playDate) > 100){
	
				playDate = Date.now();
				_this.audio.pause();
				clearInterval(timeAudio);
			}else{
				
				setTimeout(function(){

					_this.stopAudio();
				},50);
			}		
		}

		_this.conversion = function(num){

			function changInt(num){

				return (num < 10) ? '0'+num : num;
			}

			return changInt(parseInt(num/60))+":"+ changInt(Math.floor(num%60));
		}
		
		_this.upMenu = function(){

			var song = _this.song,
				inline = $(_this.menu.list).empty();

			for(var i in song){

				inline.append("<li><a href='javascript:;'>"+(song[i].title || '未知歌曲')+"</a></li>");
			}

			inline.find(">li").unbind('click').on('click',function(){

				_this.selectMenu($(this).index(),true);
			});
		}

		_this.selectMenu = function(num,_bool){

			songEq = num;
			_this.createAudio();
			(_bool) && _this.playAudio();
		}

		_this.volumeSet = function(){

			_this.audio.volume = volumeSize;
			volumeSetbacks.css({
				'height' : volumeSize*100 + "%"
			});
		}

		_this.getSong = function(i){
			songEq = i;
			console.log(i);
			_this.selectMenu(songEq,true);
		}
		_this.newSong = function(_new,_bool){

			if( typeof(_new) == 'object' ){

				if(_new.src){

					if(_this.song){

						_this.song.push(_new);
					}else{

						_this.song = [_new];
					}
					
					_this.upMenu();
					(_bool) && _this.selectMenu(_this.song.length-1,true);
				}else{

					alert('对象缺省src属性');
				}
			}else{

				alert('这不是一个对象');
			}
		}

		var volumeTime;
		volumeBox.on('mousedown',function(){

			if(_this.audio){
				var Y,EndY = parseInt(volumeBox.css('height')),goY;
				volumeBox.on('mousemove click',function(e){

					clearTimeout(volumeTime);

					Y = (e.clientY-(volumeBox.offset().top-$(document).scrollTop()));
					Y = (Y > 0) ? (Y > EndY) ? EndY : Y : 0;
	
					goY = Y/EndY;
					
					volumeSize = 1 - goY;

					_this.volumeSet();
				});
				
				volumeBox.one('mouseup',function(){

					volumeBox.unbind('mousemove');
				}).on('mouseout',function(){

					volumeTime = setTimeout(function(){

						volumeBox.unbind('mousemove');
					},500);
				});
			}
		});

		setbacks.on('mousedown',function(){

			if(_this.audio){
				var X,EndX = parseInt(setbacks.css('width')),goX,mouseTime;
				setbacks.on('mousemove click',function(e){

					_this.stopAudio();
					clearTimeout(mouseTime);

					X = (e.clientX-setbacks.offset().left);
					X = (X > 0) ? (X > EndX) ? EndX : X : 0;
					
					goX = X/EndX;
					thisSetbacks.css({
						'width' : goX*100+"%"
					});
					
					_this.audio.currentTime = parseInt(goX*_this.audio.duration);
					thisTime.text(_this.conversion(_this.audio.currentTime));
				});
				
				setbacks.one('mouseup',function(){

					_this.playAudio();
					setbacks.unbind('mousemove');
				}).on('mouseout',function(){

					mouseTime = setTimeout(function(){

						_this.playAudio();
						setbacks.unbind('mousemove');
					},500);
				});
			}
		});

		play.one('click',function(){
			var song = _this.song;
			console.info(song == null);
			if(song !== null){
				if(song.length > 0){
					_this.playAudio();

					$("#contr").addClass('resume-needle');
					$("#contr").removeClass('pause-needle');
					setTimeout(function(){
						$(".img").css({
							'animation-play-state':'running'
						});
					},500);
					
				}
			}
			
		});
		
		menuBtn.on('click',function(){

			$(_this.menu.menuView).toggleClass('menu-show');
			$(_this.box).unbind('mouseenter').unbind('mouseleave');
			event.stopPropagation();
		});

		prev.on('click',function(){

			--songEq;
			songEq = (songEq >= 0) ? songEq :  _this.song.length -1;
			_this.selectMenu(songEq,true);
		});

		next.on('click',function(){

			++songEq;
			songEq = (songEq < _this.song.length) ? songEq : 0;
			_this.selectMenu(songEq,true);
		});

		menuClose.on('click',function(){

			$(_this.menu.menuView).removeClass('menu-show');
		});

		volume.on('click',function(){
			event.stopPropagation();
			$(_this.volume.volumeView).toggleClass('audio-show-volume');
		});
		volumeView.on('click',function(){
			event.stopPropagation();
		});
		menuView.on('click',function(){
			event.stopPropagation();
		});
		box.hover(function(){
			$(_this.box).css('bottom','0px');
		},function(){
			$(_this.box).css('bottom','-63px');
		})

		deleteBtn.on('click',function(){
			var song = _this.song;
			song.length = 0;
			_this.song = song;

			$.ajax({
				type:'POST',
				url:'/music/delete',
				success:function(data){
					console.log(data.success);
				}
			});
			console.log(_this.song);
			$(".audio-inline").empty();
			$(".audio-this-time").text("00:00");
			$(".audio-count-time").text("00:00");
			$(".audio-title").text("");
			$(".audio-cache-setbacks").css({
				"width":'0px'
			});
			$(".audio-this-setbacks").css({
				"width":'0px'
			});
			$(".audio-backs-btn").css({

			});
			$(".audio-play").removeClass("audio-stop");
			clearInterval(timeAudio);
			_this.stopAudio();
			//当前音源设为空
			_this.audio.src = "";
			$("#contr").addClass('pause-needle');
			$("#contr").removeClass('resume-needle');
			setTimeout(function(){
				$(".img").css({
					"animation-play-state":"paused"
				});
			},500);
			
		});
		$(document).click(function(){
		// alert("1");
			$('.audio-list').removeClass("menu-show");
			$('.audio-set-volume').removeClass("audio-show-volume");
			$('.audio-box').css('bottom','-63px');
			$('.audio-box').bind({mouseenter:function(){
				$('.audio-box').css('bottom','0px');
			},mouseleave:function(){
				$('.audio-box').css('bottom','-63px');
			}});
			
		});



		_this.upMenu();

		_this.selectMenu(songEq,_this.autoPlay);
		
		return _this;
	}
})(jQuery)
// var song = new Array();
$(function(){
	$('#player').click(function(){
		// alert("1")
	})
	//在文本加载式进行异步请求，查看服务器端session中是否有music对象,并且取出进行加载
	var audioFn;

	$.ajax({
		type:'post',
		url:'/music/getMusic',
		success:function(data){
			if(data.success == 1){
				var musics = data.musics;
				if(musics.length !== 0){
					var song = new Array();
					for(var i in musics){
						var a = {
							'id':musics[i]._id,
							'cover':'',
							'src':musics[i].song,
							'singer':musics[i].singer,
							'title':musics[i].title + "-" +musics[i].singer
						}
						song.push(a);
					}
					// console.log(song);
					audioFn = audioPlay({
						song:song,
						autoPlay:false
					});
					// console.log(audioFn.song);
				}else{
					audioFn = audioPlay({});

				}
				
				// console.log(audioFn.played);
			}else{
				audioFn = audioPlay({});
			}
			
		}
	});


// console.log(audioFn);
	
	//点击按钮后异步提交数据
	//播放
	$('#play').on('click',function(e){
		console.log("asdasd");
		var target = $(e.target);
		var id = target.data(id);

		
		$("#contr").addClass('resume-needle');
		$("#contr").removeClass('pause-needle');
		setTimeout(function(){
			$(".img").css({
				'animation-play-state':'running'
			});
		},500);
		$.ajax({
			type:'POST',
			url:'/music/player',
			data:id,
			success:function(data){
				if(data.success == 0){
					var songs = audioFn.song;
					console.log(songs);
					var isHaveSong = false;
					for(var i = 0; i < songs.length; i++){
						if(songs[i].id == id.id){
							isHaveSong = true;
							console.log(isHaveSong);
							audioFn.getSong(0);
							break;
						}
					}
				}
				if(data.success == 1){
					var src = data.music.song;
					var title = data.music.title + "-" + data.music.singer;
					audioFn.newSong({
						'id':data.music._id,
						'cover':'',
						'src':src,
						'singer':data.music.singer,
						'title':title
					},true);
				}
			}
		});
	});

	//添加
	$("#add").one('click',function(e){
		var target = $(e.target);
		var id = target.data(id);
		$.ajax({
			type:'POST',
			url:'/music/player',
			data:id,
			success:function(data){
				if(data.success == 1){
					var src = data.music.song;
					var title = data.music.title + "-" + data.music.singer;
					audioFn.newSong({
						'id':data.music._id,
						'cover':'',
						'src':src,
						'singer':data.music.singer,
						'title':title
					},false);
				}
			}
		});
	});


	//首页播放
	$('.btn-paly').one("click",function(){
		var target = $(this);
		var id = target.data(id);
		// console.log(id);
		$.ajax({
			type:'POST',
			url:'/music/player',
			data:id,
			success:function(data){
				if(data.success == 1){
					var src = data.music.song;
					var title = data.music.title + "-" + data.music.singer;
					audioFn.newSong({
						'id':data.music._id,
						'cover':'',
						'src':src,
						'singer':data.music.singer,
						'title':title
					},true);
				}
			}
		});
	});
	//首页添加
	$('.btn-add').one("click",function(){
		var target = $(this);
		var id = target.data(id);
		$.ajax({
			type:'POST',
			url:'/music/player',
			data:id,
			success:function(data){
				if(data.success == 1){
					var src = data.music.song;
					var title = data.music.title + "-" + data.music.singer;
					audioFn.newSong({
						'id':data.music._id,
						'cover':'',
						'src':src,
						'singer':data.music.singer,
						'title':title
					},false);
				}
			}
		});
	});
	
});
