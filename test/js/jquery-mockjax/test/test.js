var mockjaxDefaults = $.extend({}, $.mockjaxSettings);

function noErrorCallbackExpected() {
	ok( false, 'Error callback executed');
}

// Speed up our tests
$.mockjaxSettings.responseTime = 0;

module('Core');
test('Return XMLHttpRequest object from $.ajax', function() {
	$.mockjax({
		url: '/xmlhttprequest',
		responseText: "Hello Word"
	});

	var xhr = $.ajax({
		url: '/xmlhttprequest',
		complete: function() { }
	});
	xhr && xhr.abort && xhr.abort();

	ok(xhr, "XHR object is not null or undefined");
	if (jQuery.Deferred) {
		ok(xhr.done && xhr.fail, "Got Promise methods");
	}

	$.mockjaxClear();
});
asyncTest('Intercept and proxy (sub-ajax request)', function() {
	$.mockjax({
		url: '/proxy',
		proxy: 'test_proxy.json'
	});

	$.ajax({
		url: '/proxy',
		dataType: 'json',
		success: function(json) {
			ok(json && json.proxy, 'Proxy request succeeded');
		},
		error: noErrorCallbackExpected,
		complete: function() {
			start();
		}
	});

	$.mockjaxClear();
});

asyncTest('Support 1.5 $.ajax(url, settings) signature.', function() {
	$.mockjax({
		url: '/resource',
		responseText: 'Hello Word'
	});

	$.ajax('/resource', {
		success: function(response) {
			equal(response, 'Hello Word');
		},
		error: noErrorCallbackExpected,
		complete: function() {
			start();
		}
	});

	$.mockjaxClear();
});

asyncTest('Dynamic response callback', function() {
	$.mockjax({
		url: '/response-callback',
		response: function(settings) {
			this.responseText = settings.data.response + ' 2';
		}
	});

	$.ajax({
		url: '/response-callback',
		dataType: 'text',
		data: {
			response: 'Hello world'
		},
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.responseText, 'Hello world 2', 'Response Text matches');
			start();
		}
	});

	$.mockjaxClear();
});

asyncTest('Dynamic response status callback', function() {
	$.mockjax({
		url: '/response-callback',
		response: function(settings) {
      this.status = 500;
		}
	});

	$.ajax({
		url: '/response-callback',
		dataType: 'text',
		data: {
			response: 'Hello world'
		},
		error: function(){ ok(true, "error callback was called"); },
		complete: function(xhr) {
			equals(xhr.status, 500, 'Dynamically set response status matches');
			start();
		}
	});

	$.mockjaxClear();
});

test('Remove mockjax definition by id', function() {
	var id = $.mockjax({
		url: '/test',
		contentType: 'text/plain',
		responseText: 'test'
	});

	$.mockjax({
		url: '*',
		contentType: 'text/plain',
		responseText: 'default'
	});

	stop();
	$.ajax({
		url: '/test',
		success: function(text) {
			equals(text, 'test', 'Test handler responded');
		},
		error: noErrorCallbackExpected,
		complete: function() {
			$.mockjaxClear(id);

			// Reissue the request expecting the default handler
			$.ajax({
				url: '/test',
				success: function(text) {
					equals(text, 'default', 'Default handler responded');
				},
				error: noErrorCallbackExpected,
				complete: function(xhr) {
					equals(xhr.responseText, 'default', 'Default handler responded');

					$.mockjaxClear();
					start();
				}
			});
		}
	});
});
asyncTest('Intercept log messages', function() {
	var msg = null;
	$.mockjaxSettings.log = function(inMsg, settings) {
		msg = inMsg;
	};
	$.mockjax({
		url: '*'
	});
	$.ajax({
		url: '/console',
		type: 'GET',
		complete: function() {
			equals(msg, 'MOCK GET: /console', 'Mock request logged to console');
			$.mockjaxClear();
			start();
		}
	});
});
asyncTest('Disable console logging', function() {
	var msg = null;
	$.mockjaxSettings.console = false;
	$.mockjax({
		url: '*'
	});
	$.ajax({
		url: '/console',
		complete: function() {
			equals(msg, null, 'Mock request not logged');
			$.mockjaxClear();
			start();
		}
	});
});

module('Request Property Inspection');
test('Inspecting $.mockjax.handler(id) after request has fired', function() {
  var ID = $.mockjax({
    url: '/mockjax_properties',
    responseText: "Hello Word"
  });

  var xhr = $.ajax({
      url: '/mockjax_properties',
      complete: function() {}
  });

  ok($.mockjax.handler(ID).fired, "Sets the mock's fired property to true");

  $.mockjaxClear();
});

asyncTest('Inspecting $.mockjax.handler\'s data after request has fired', function() {
  var ID = $.mockjax({
    url: '/mockjax_data_properties',
    responseText: "Hello Word"
  });

  var xhr = $.ajax({
      url: '/mockjax_data_properties',
      data: {
        'param1': 'value1'
      },
      beforeSend: function() {
        equals($.mockjax.handler(ID).data.param1, 'value1', 'Stores request data on the mock request object');
      },
      complete: function() {
        $.mockjaxClear();
        start();
      }
  });

  ok($.mockjax.handler(ID).fired, "Sets the mock's fired property to true");

});

module('Type Matching');
asyncTest('Case-insensitive matching for request types', function() {
	$.mockjax({
		url: '/case_insensitive_match',
		type: 'GET',
		responseText: 'uppercase type response'
	});

	$.ajax({
		url: '/case_insensitive_match',
		type: 'get',
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.responseText, 'uppercase type response', 'Request matched regardless of case');
			start();
		}
	});

	$.mockjaxClear();
});

module('URL Matching');
asyncTest('Exact string', function() {
	$.mockjax({
		url: '/exact/string',
		responseText: 'exact string'
	});
	$.mockjax({
		url: '*',
		responseText: 'catch all'
	});

	$.ajax({
		url: '/exact/string',
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.responseText, 'exact string', 'Exact string url match');
			start();
		}
	});

	$.mockjaxClear();
});
test('Wildcard match', 4, function() {
	function mock(mockUrl, url, response) {
		$.mockjax({
			url: mockUrl,
			responseText: response
		});
		$.ajax({
			async: false,
			url: url,
			error: noErrorCallbackExpected,
			complete: function(xhr) {
				equals(xhr.responseText, response);
			}
		});
	}
	mock('/wildcard*w', '/wildcard/123456/w', 'w');
	mock('/wildcard*x', '/wildcard/123456/x', 'x');
	mock('*y', '/wildcard/123456/y', 'y');
	mock('z*', 'z/wildcard/123456', 'z');

	$.mockjaxClear();
});
asyncTest('RegEx match', 1, function() {
	$.mockjax({
		url: /^\/regex-([0-9]+)/i,
		responseText: 'regex match'
	});
	$.mockjax({
		url: '*',
		responseText: 'catch all'
	});

	$.ajax({
		url: '/regex-123456',
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.responseText, 'regex match', 'RegEx match');
			start();
		}
	});

	$.mockjaxClear();
});


// Test Data Types [Text, HTML, JSON, JSONP, Script and XML]
module('Data Types');
// Text
asyncTest('Response returns text', function() {
	$.mockjax({
		url: '/text',
		contentType:  'text/plain',
		responseText: 'just text'
	});
	$.ajax({
		url: '/text',
		dataType: 'text',
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.getResponseHeader('Content-Type'), 'text/plain', 'Content type of text/plain');

			start();
		}
	});
	$.mockjaxClear();
});
asyncTest('Response returns html', function() {
	$.mockjax({
		url: '/html',
		contentType:  'text/html',
		responseText: '<div>String</div>'
	});
	$.ajax({
		url: '/html',
		dataType: 'html',
		success: function(data) {
			equals(data, '<div>String</div>', 'HTML String matches');
		},
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.getResponseHeader('Content-Type'), 'text/html', 'Content type of text/html');
			start();
		}
	});
	$.mockjaxClear();
});
asyncTest('Response returns json', function() {
	$.mockjax({
		url: '/json',
		contentType:  'text/json',
		responseText: { "foo" : "bar", "baz" : { "car" : "far" } }
	});
	$.ajax({
		url: '/json',
		dataType: 'json',
		success: function(json) {
			deepEqual(json, { "foo" : "bar", "baz" : { "car" : "far" } }, 'JSON Object matches');
		},
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.getResponseHeader('Content-Type'), 'text/json', 'Content type of text/json');
			start();
		}
	});
	$.mockjaxClear();
});
asyncTest('Response returns jsonp', 3, function() {
	$.mockjax({
		url: '/jsonp*',
		contentType: 'text/json',
		proxy: 'test_jsonp.js'
	});
	window.abcdef123456 = function(json) {
		ok( true, 'JSONP Callback executed');
		deepEqual(json, { "data" : "JSONP is cool" });
	};

	$.ajax({
		url: '/jsonp?callback=?',
		jsonpCallback: 'abcdef123456',
		dataType: 'jsonp',
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(xhr.getResponseHeader('Content-Type'), 'text/json', 'Content type of text/json');
			start();
		}
	});
	$.mockjaxClear();
});
asyncTest('Response executes script', function() {
	$.mockjax({
		url: '/script',
		contentType: 'text/plain',
		proxy: 'test_script.js'
	});

	window.TEST_SCRIPT_VAR = 0;
	$.ajax({
		url: '/script',
		dataType: 'script',
		error: noErrorCallbackExpected,
		complete: function(xhr) {
			equals(window.TEST_SCRIPT_VAR, 1, 'Script executed');
			equals(xhr.getResponseHeader('Content-Type'), 'text/plain', 'Content type of text/plain');

			start();
		}
	});
	$.mockjaxClear();
});
asyncTest('Response returns parsed XML', function() {
	$.mockjax({
		url: '/xml',
		contentType:  'text/xml',
		responseXML: '<document>String</document>'
	});
	$.ajax({
		url: '/xml',
		dataType: 'xml',
		success: function(xmlDom) {
			ok( jQuery.isXMLDoc( xmlDom ), 'Data returned is an XML DOM');
		},
		error: noErrorCallbackExpected,
		complete: function(xhr, error) {
			ok(true, 'Error: ' + error);
			equals(xhr.getResponseHeader('Content-Type'), 'text/xml', 'Content type of text/xml');
			start();
		}
	});
	$.mockjaxClear();
});

module('Connection Simulation', {
	setup: function() {
		$.mockjax({
			url: '/delay',
			responseTime: 150
		});
		$.mockjax({
			url: '*',
			responseText: '',
			responseTime: 50
		});
	},
	teardown: function() {
		$.mockjaxClear();
	}
});
asyncTest('Async test', function() {
	var order = [];
	$.ajax({
		async: true,
		url: '/',
		success: function() {
			order.push('b');
		},
		error: noErrorCallbackExpected,
		complete: function() {
			deepEqual(order, ['a', 'b'], 'Order of execution correct, 2');
			start();
		}
	});
	order.push('a');
	deepEqual(order, ['a'], 'Order of execution correct, 1');
});
test('Sync test', function() {
	var order = [];
	$.ajax({
		async: false,
		url: '/',
		success: function() {
			order.push('b');
			deepEqual(order, ['b'], 'Order of execution correct, 1');
		},
		error: noErrorCallbackExpected
	});
	order.push('a');
	deepEqual(order, ['b', 'a'], 'Order of execution correct, 2');
});
asyncTest('Response time simulation and latency', function() {
	var executed = 0, ts = new Date();
	$.ajax({
		url: '/delay',
		complete: function() {
			var delay = ((new Date()) - ts);
			ok( delay >= 150, 'Correct delay simulation (' + delay + ')' );
			equals( executed, 1, 'Callback execution order correct');
			start();
		}
	});
	setTimeout(function() {
		ok( executed == 0, 'No premature callback execution');
		executed++;
	}, 30);
});

module('Headers');
asyncTest('headers can be inspected via setRequestHeader()', function() {
	var mock;
	$('html').ajaxSend(function(event, xhr, ajaxSettings) {
		xhr.setRequestHeader('X-CSRFToken', '<this is a token>');
	});
	mock = $.mockjax({
		url: '/inspect-headers',
		response: function(settings) {
			var key;
			if (typeof this.headers['X-Csrftoken'] !== 'undefined') {
				key = 'X-Csrftoken';  // bugs in jquery 1.5
			} else {
				key = 'X-CSRFToken';
			}
			equals(this.headers[key], '<this is a token>');
			$.mockjaxClear(mock);
			start();
		}
	});
	$.ajax({
		url: '/inspect-headers',
		complete: function() {}
	});
});


// TODO: SIMULATING HTTP RESPONSE STATUSES
// TODO: SETTING THE CONTENT-TYPE
// TODO: SETTING ADDITIONAL HTTP RESPONSE HEADERS
// TODO: FORCE SIMULATION OF SERVER TIMEOUTS
// TODO: DYNAMICALLY GENERATING MOCK DEFINITIONS
// TODO: DYNAMICALLY GENERATING MOCK RESPONSES
/*
var id = $.mockjax({
   ...
});
$.mockjaxClear(id);
*/

/*
(function($) {
	$(function() {
		$.ajax({
			url: 'test.json',
			success: function(data) {
				$('ul').append('<li>test.json: completed (' + data.test + ')</li>');
			}
		});

		$.mockjax({
			url: 'test.json',
			contentType: 'text/json',
			responseText: { "test": "mock message" }
		});

		$.ajax({
			url: 'test.json',
			dataType: 'json',
			success: function(data) {
				$('ul').append('<li>test.json: completed (' + data.test + ')</li>');
			},
			error: function(xhr, status, error) {
				alert('error: ' + status + ' ' + error);
			},
			complete: function() {
			}
		});

		$.mockjax({
			url: 'http://google.com',
			responseText: 'alert("Hello world");'
		});

		$.mockjax({
			url: 'http://another-cross-domain.com',
			responseText: function() {
				alert("Get script mock");
			}
		});

		$.ajax({
			url: 'http://google.com',
			dataType: 'script',
			success: function(data) {
				$('ul').append('<li>script: completed (' + data.test + ')</li>');
			},
			error: function(xhr, status, error) {
				alert('error: ' + status + ' ' + error);
			},
			complete: function() {
			}
		});
	});
})(jQuery);
*/
