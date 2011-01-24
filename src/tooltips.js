var jamesmedia=jamesmedia||{};
jamesmedia.maps=jamesmedia.maps||{};
jamesmedia.maps.v3=jamesmedia.maps.v3||{};

jamesmedia.maps.v3.MarkerTooltip = function(anchor, opt_options){	
	this.setValues({
		renderer : null,
		className : null,
		pixelOffset : {x:0, y:-2}
	});
	this.setValues(opt_options || {});
	
	if (anchor) this.set('anchor', anchor);
	
	this.els = {};
	var el = this.els.outer = document.createElement('div');
	var cls = this.get('className');
	if (cls) {
		el.outer.className = cls;
	} else {
		// Default style
		el.style.position='absolute';
		el.style.border='1px solid #aaa';
		el.style.background='white';
		el.style.padding='3px';
		el.style.fontSize='11px';
		el.style.zIndex=999;
	}
	el.innerHTML = '&nbsp;';
	this.hide();
}
jamesmedia.maps.v3.MarkerTooltip.prototype = new google.maps.OverlayView;

jamesmedia.maps.v3.MarkerTooltip.prototype.onAdd = function() {
	var pane = this.getPanes().floatShadow;
	pane.appendChild(this.els.outer);
	var _this = this;
	google.maps.event.addListener(this, 'anchor_changed', function() { _this.draw(); });
};

jamesmedia.maps.v3.MarkerTooltip.prototype.monitorMarker = function(m){
	var _this = this;
	google.maps.event.addListener(m, 'mouseover', function() { 
		_this.setAnchor(m);
		_this.show();
	});
	google.maps.event.addListener(m, 'mouseout', function() { 
		_this.hide();
	});
}

jamesmedia.maps.v3.MarkerTooltip.prototype.hide = function(){
	this.els.outer.style.visibility = 'hidden';
}

jamesmedia.maps.v3.MarkerTooltip.prototype.show = function(){
	this.els.outer.style.visibility = '';
}

jamesmedia.maps.v3.MarkerTooltip.prototype.setAnchor = function(anchor){
	this.set('anchor', anchor);
}

jamesmedia.maps.v3.MarkerTooltip.prototype.draw = function() {

	var anchor = this.get('anchor');
	var renderer = this.get('renderer');
	
	var title = anchor ? anchor.get('title') : '';
	var html = renderer ? renderer(title) : title;
	
	this.els.outer.innerHTML = html;

	var tooltipOffset = [0, 0];

	if (anchor && anchor.pixelBounds){
		var pbc = anchor.pixelBounds.getCenter();
		tooltipOffset  = [0, (2*pbc.y)];
	}
	
	var offset = this.get('pixelOffset');
	if (offset) {
		tooltipOffset[0] += offset.x;
		tooltipOffset[1] += offset.y;
	}
	
	var ts = [this.els.outer.clientWidth, this.els.outer.clientHeight];

	var latlng = anchor ? anchor.getPosition() : new google.maps.LatLng(0,0);
	var position = this.getProjection().fromLatLngToDivPixel(latlng);

	position.x += tooltipOffset[0]-ts[0]/2;
	position.y += tooltipOffset[1]-ts[1];
	
	var el = this.els.outer;
	el.style.left = position.x + 'px';
	el.style.top = position.y + 'px';
};