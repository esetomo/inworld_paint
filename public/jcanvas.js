/*!
jCanvas v2.4
Caleb Evans
*/
(function($, document, Math, undefined) {

// jCanvas object
var jC = {};
jC.defaults = {
	width: 0,
	height: 0,
	cornerRadius: 0,
	fillStyle: 'transparent',
	strokeStyle: 'transparent',
	strokeWidth: 1,
	strokeCap: 'butt',
	strokeJoin: 'miter',
	shadowX: 0,
	shadowY: 0,
	shadowBlur: 3,
	shadowColor: 'transparent',
	x: 0, y: 0,
	x1: 0, y1: 0,
	radius: 0,
	start: 0,
	end: 360,
	ccw: false,
	inDegrees: true,
	fromCenter: true,
	closed: false,
	sides: 3,
	angle: 0,
	text: '',
	font: 'normal 12pt sans-serif',
	align: 'center',
	baseline: 'middle',
	source: '',
	repeat: 'repeat'
};
// Duplicate defaults to preferences
jC.prefs = $.extend({}, jC.defaults);

// Set global properties
function setGlobals(context, params) {
	context.fillStyle = params.fillStyle || params.fillColor;
	context.strokeStyle = params.strokeStyle || params.strokeColor;
	context.lineWidth = params.strokeWidth;
	context.lineCap = params.strokeCap;
	context.lineJoin = params.strokeJoin;
	context.shadowOffsetX = params.shadowX;
	context.shadowOffsetY = params.shadowY;
	context.shadowBlur = params.shadowBlur;
	context.shadowColor = params.shadowColor;
}

// Close path if chosen
function closePath(context, params) {
	if (params.closed === true) {
		context.closePath();
		context.fill();
		context.stroke();
	} else {
		context.fill();
		context.stroke();
		context.closePath();
	}
}

// Measure angles in degrees if chosen
function checkUnits(params) {
	if (params.inDegrees === true) {
		return Math.PI / 180;
	} else {
		return 1;
	}
}

// Set canvas defaults
$.fn.canvas = function(args) {
	// Reset defaults if no value is passed
	if (args === undefined) {
		jC.prefs = jC.defaults;
	} else {
		jC.prefs = $.extend({}, jC.prefs, args);
	}
	return this;
};

// Load canvas
$.fn.loadCanvas = function(context) {
	if (context === undefined) {context = '2d';}
	return this[0].getContext(context);
};

// Draw on canvas manually
$.fn.draw = function(callback) {
	var context = this.loadCanvas();
	callback(context);
	return this;
};

// Create gradient
$.fn.gradient = function(args) {
	var ctx = this.loadCanvas(),
		// Specify custom defaults
		gDefaults = {
			x1: 0, y1: 0,
			x2: 0, y2: 0,
			r1: 10, r2: 100
		},
		params = $.extend({}, gDefaults, args),
		gradient, stops = 0, percent, i = 1;
		
	// Create radial gradient if chosen
	if (args.r1 === undefined && args.r2 === undefined) {
		gradient = ctx.createLinearGradient(params.x1, params.y1, params.x2, params.y2);
	} else {
		gradient = ctx.createRadialGradient(params.x1, params.y1, params.r1, params.x2, params.y2, params.r2);
	}
	
	// Count number of color stops
	while (params['c' + i] !== undefined) {
		stops += 1;
		i += 1;
	}
	
	// Calculate color stop percentages if absent
	for (i=1; i<=stops; i+=1) {
		percent = Math.round((stops-1) * (i-1));
		if (params['s' + i] === undefined) {
			params['s' + i] = percent;
		}
		gradient.addColorStop(params['s' + i], params['c' + i]);
	}
	return gradient;
};

// Create pattern
$.fn.pattern = function(args) {
	var ctx = this.loadCanvas(),
		params = $.extend({}, jC.prefs, args),
		pattern,
		img = document.createElement('img');
	img.src = params.source;
	
	// Create pattern
	function create() {
		if (img.complete === true) {
			// Create pattern
			pattern = ctx.createPattern(img, params.repeat);
		} else {
			throw "The pattern has not loaded yet";
		}
	}
	try {
		create();
	} catch(error) {
		img.onload = create;
	}
	return pattern;
};

// Clear canvas
$.fn.clearCanvas = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args);

	// Draw from center if chosen
	if (params.fromCenter === true) {
		params.x -= params.width / 2;
		params.y -= params.height / 2;
	}

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);

		// Clear entire canvas if chosen
		ctx.beginPath();
		if (args === undefined) {
			ctx.clearRect(0, 0, this.width(), this.height());
		} else {
			ctx.clearRect(params.x, params.y, params.width, params.height);
		} 
		ctx.closePath();
	}
	return this;
};

// Save canvas
$.fn.saveCanvas = function() {
	var ctx, e;
	
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		
		ctx.save();
	}
	return this;
};

// Restore canvas
$.fn.restoreCanvas = function() {
	var ctx, e;
	
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
	
		ctx.restore();
	}
	return this;
};

// Scale canvas
$.fn.scaleCanvas = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args);
		
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');

		ctx.save();
		ctx.translate(params.x, params.y);
		ctx.scale(params.width, params.height);
		ctx.translate(-params.x, -params.y);
	}
	return this;
};

// Translate canvas
$.fn.translateCanvas = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args);

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		
		ctx.save();
		ctx.translate(params.x, params.y);
	}
	return this;
};

// Rotate canvas
$.fn.rotateCanvas = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		toRad = checkUnits(params);
	
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		
		ctx.save();
		ctx.translate(params.x, params.y);
		ctx.rotate(params.angle * toRad);
		ctx.translate(-params.x, -params.y);
	}
	return this;
};

// Draw rectangle
$.fn.drawRect = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		toRad = checkUnits(params),
		x1, y1, x2, y2, r;
	
	// Draw from center if chosen
	if (params.fromCenter === true) {
		params.x -= params.width / 2;
		params.y -= params.height / 2;
	}

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
	
		// Draw rounded rectangle if chosen
		if (params.cornerRadius > 0) {
			x1 = params.x;
			y1 = params.y;
			x2 = params.x + params.width;
			y2 = params.y + params.height;
			r = params.cornerRadius;
			if ((x2 - x1) - (2 * r) < 0) {
				r = (x2 - x1) / 2;
			}
			if ((y2 - y1) - (2 * r) < 0) {
				r = (y2 - y1) / 2;
			}
			ctx.beginPath();
			ctx.moveTo(x1+r,y1);
			ctx.lineTo(x2-r,y1);
			ctx.arc(x2-r, y1+r, r, 270*toRad, 360*toRad, false);
			ctx.lineTo(x2,y2-r);
			ctx.arc(x2-r, y2-r, r, 0, 90*toRad, false);
			ctx.lineTo(x1+r,y2);
			ctx.arc(x1+r, y2-r, r, 90*toRad, 180*toRad, false);
			ctx.lineTo(x1,y1+r);
			ctx.arc(x1+r, y1+r, r, 180*toRad, 270*toRad, false);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		} else {
			ctx.fillRect(params.x, params.y, params.width, params.height);
			ctx.strokeRect(params.x, params.y, params.width, params.height);
		}
	}
	return this;
};

// Draw arc
$.fn.drawArc = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		toRad = checkUnits(params);
	
	// Draw from center if chosen
	if (params.fromCenter === false) {
		params.x += params.radius;
		params.y += params.radius;
	}
	
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
	
		ctx.beginPath();
		ctx.arc(params.x, params.y, params.radius, (params.start*toRad)-(Math.PI/2), (params.end*toRad)-(Math.PI/2), params.ccw);
		// Close path if chosen
		closePath(ctx, params);
	}
	return this;
};

// Draw ellipse
$.fn.drawEllipse = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		controlW = params.width * (4/3);
	
	// Draw from center if chosen
	if (params.fromCenter === false) {
		params.x += params.width / 2;
		params.y += params.height / 2;
	}
		
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
		
		// Create ellipse
		ctx.beginPath();
		ctx.moveTo(params.x, params.y-params.height/2);
		ctx.bezierCurveTo(params.x-controlW/2,params.y-params.height/2,
			params.x-controlW/2,params.y+params.height/2,
			params.x,params.y+params.height/2);
		ctx.bezierCurveTo(params.x+controlW/2,params.y+params.height/2,
			params.x+controlW/2,params.y-params.height/2,
			params.x,params.y-params.height/2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	return this;
};

// Draw line
$.fn.drawLine = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		l = 2, lx = 0, ly = 0;

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
		
		// Draw each point
		ctx.beginPath();
		ctx.moveTo(params.x1, params.y1);
		while (lx >= 0 && ly >= 0) {
			lx = params['x' + l];
			ly = params['y' + l];
			ctx.lineTo(lx, ly);
			l += 1;
		}
		// Close path if chosen
		closePath(ctx, params);
	}
	return this;
};

// Draw quadratic curve
$.fn.drawQuad = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		l = 2,
		lx = 0, ly = 0,
		lcx = 0, lcy = 0;

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
			
		// Draw each point
		ctx.beginPath();
		ctx.moveTo(params.x1, params.y1);
		while (lx >= 0 && ly >= 0 && lcx >= 0 && lcy >= 0) {
			lx = params['x' + l];
			ly = params['y' + l];
			lcx = params['cx' + (l-1)];
			lcy = params['cy' + (l-1)];
			ctx.quadraticCurveTo(lcx, lcy, lx, ly);
			l += 1;
		}
		// Close path if chosen
		closePath(ctx, params);
	}
	return this;
};

// Draw Bezier curve
$.fn.drawBezier = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		l = 2, lc = 1, i,
		lx = 0, ly = 0,
		lcx1 = 0, lcy1 = 0,
		lcx2 = 0, lcy2 = 0;

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
	
		// Draw each point
		ctx.beginPath();
		ctx.moveTo(params.x1, params.y1);
		while (lx >=0 && ly >=0 && lcx1 >=0 && lcy1 >=0 && lcx2 >=0 && lcy2 >=0) {
			lx = params['x' + l];
			ly = params['y' + l];
			lcx1 = params['cx' + lc];
			lcy1 = params['cy' + lc];
			lcx2 = params['cx' + (lc+1)];
			lcy2 = params['cy' + (lc+1)];
			ctx.bezierCurveTo(lcx1, lcy1, lcx2, lcy2, lx, ly);
			l += 1;
			lc += 2;
		}
		// Close path if chosen
		closePath(ctx, params);
	}
	return this;
};

// Draw text
$.fn.drawText = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args);

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
	
		// Set text-specific properties
		ctx.textBaseline = params.baseline;
		ctx.textAlign = params.align;
		ctx.font = params.font;
		
		ctx.strokeText(params.text, params.x, params.y);
		ctx.fillText(params.text, params.x, params.y);
	}
	return this;
};

// Draw image
$.fn.drawImage = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		// Define image source
		img = document.createElement('img'),
		scaleFac;
	img.src = params.source;

	// Draw image function
	function draw(ctx) {
		if (img.complete === true) {
			scaleFac = img.width / img.height;
			// If width/height are specified
			if (args.width !== undefined && args.height !== undefined) {
				img.width = args.width;
				img.height = args.height;
			// If width is specified
			} else if (args.width !== undefined && args.height === undefined) {
				img.width = args.width;
				img.height = img.width / scaleFac;
			// If height is specified
			} else if (args.width === undefined && args.height !== undefined) {
				img.height = args.height;
				img.width = img.height * scaleFac;
			}
		
			// Draw from center if chosen
			if (params.fromCenter === true) {
				params.x -= img.width / 2;
				params.y -= img.height / 2;
			}
						
			// Draw image
			ctx.drawImage(img, params.x, params.y, img.width, img.height);
			return true;
		} else {
			return false;
		}
	}
	function onload() {
		draw(ctx);
	}
	// Draw image if already loaded
	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
		
		// Draw when image is loaded
		if (draw(ctx) === false) {
			img.onload = onload;
		}
	}
	return this;
};

// Draw polygon
$.fn.drawPolygon = function(args) {
	var ctx, e,
		params = $.extend({}, jC.prefs, args),
		theta, dtheta, x, y,
		toRad = checkUnits(params), i;
	params.closed = true;

	theta = (Math.PI/2) + (Math.PI/params.sides) + (params.angle*toRad);
	dtheta = (Math.PI*2) / params.sides;

	for (e=0; e<this.length; e+=1) {
		ctx = this[e].getContext('2d');
		setGlobals(ctx, params);
	
		// Calculate points and draw
		if (params.sides >= 3) {		
			for (i=0; i<params.sides; i+=1) {
				x = params.x + (params.radius * Math.cos(theta));
				y = params.y + (params.radius * Math.sin(theta));
				if (params.fromCenter === false) {
					x += params.radius;
					y += params.radius;
				}
				ctx.lineTo(x, y);
				theta += dtheta;
			}
			closePath(ctx, params);
		}
	}
	return this;
};

return ($.jCanvas = jC);
}(jQuery, document, Math));