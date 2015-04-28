/*! 
 * todataurl-png-js
 * https://github.com/AdamMerrifield/todataurl-png-js
 * original implementation: https://code.google.com/p/todataurl-png-js/
 */

(function(){
	var crctable = false,
		tdu = HTMLCanvasElement.prototype.toDataURL;

	function toUInt(num){
		return num < 0 ? num + 4294967296 : num;
	}

	function bytes32(num){
		return [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff];
	}

	function bytes16sw(num){
		return [num & 0xff, (num >>> 8) & 0xff];
	}

	function adler32(arr, start, len){
		start = start || 0;
		len = typeof len === 'undefined' ? arr.length - start : len;

		var a = 1,
			b = 0,
			i = 0;

		for(; i < len; i++){
			a = (a + this[start + i]) % 65521;
			b = (b + a) % 65521;
		}

		return toUInt((b << 16) | a);
	}

	function crc32(arr, start, len){
		start = start || 0;
		len = typeof len === 'undefined' ? arr.length - start : len;

		var i = 0,
			n = 0,
			k = 0,
			c;

		if(!crctable){
			crctable = [];
			for(; n < 256; n++){
				c = n;
				k = 0;
				
				for(; k < 8; k++){
					c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
				}
				
				crctable[n] = toUInt(c);
			}
		}

		c = 0xffffffff;
		for(; i < len; i++){
			c = crctable[(c ^ arr[start + i]) & 0xff] ^ (c >>> 8);
		}

		return toUInt(c ^ 0xffffffff);
	}

	function toDataURL(){
		var w = this.width,
			h = this.height,
			imageData = Array.prototype.slice.call(this.getContext('2d').getImageData(0, 0, w, h).data),
			stream = [
				0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
				0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52
			],
			len = h * (w * 4 + 1),
			y = 0,
			i = 0,
			blocks = Math.ceil(len / 32768),
			crcStart, crcLen, blockLen, id;

		Array.prototype.push.apply(stream, bytes32(w));
		Array.prototype.push.apply(stream, bytes32(h));
		stream.push(0x08, 0x06, 0x00, 0x00, 0x00);
		Array.prototype.push.apply(stream, bytes32(crc32(stream, 12, 17)));
		
		for(; y < h; y++){
			imageData.splice(y * (w * 4 + 1), 0, 0);
		}
		
		Array.prototype.push.apply(stream, bytes32((len + 5 * blocks + 6)));
		crcStart = stream.length;
		crcLen = (len + 5 * blocks + 6 + 4);
		stream.push(0x49, 0x44, 0x41, 0x54, 0x78, 0x01);
		
		for(; i < blocks; i++){
			blockLen = Math.min(32768, len - (i * 32768));
			stream.push(i == (blocks - 1) ? 0x01 : 0x00);
			Array.prototype.push.apply(stream, bytes16sw(blockLen));
			Array.prototype.push.apply(stream, bytes16sw((~blockLen)));
			id = imageData.slice(i * 32768, i * 32768 + blockLen);
			Array.prototype.push.apply(stream, id);
		}
		
		Array.prototype.push.apply(stream, bytes32(adler32(imageData)));
		Array.prototype.push.apply(stream, bytes32(crc32(stream, crcStart, crcLen)));

		stream.push(0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44);
		Array.prototype.push.apply(stream, bytes32(crc32(stream, stream.length - 4, 4)));

		crctable = false;

		return 'data:image/png;base64,' + btoa(stream.map(function(c){
			return String.fromCharCode(c);
		}).join(''));
	}
	
	HTMLCanvasElement.prototype.toDataURL = function(type){
		var res = tdu.apply(this, arguments);
		
		if(res === 'data:,'){
			HTMLCanvasElement.prototype.toDataURL = toDataURL;
			return this.toDataURL();
		}else{
			HTMLCanvasElement.prototype.toDataURL = tdu;
			return res;
		}
	};
	
})();