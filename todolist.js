// on / offline 동기화 하는 객체
var TODOSynchronizer = {
	onOffListener: function() {
		document.getElementById('header').classList[navigator.onLine ? 'remove' : 'add']('offline');
	},
	init: function() {
		window.addEventListener('online', this.onOffListener, false);
		window.addEventListener('offline', this.onOffListener, false);
	}
};

var TODOFilter = {
	filter: document.getElementById('filters'),
	todoList: document.getElementById('todo-list'),
    curIdx: 0,
    states: {
        active: {
            data: 'active',
            url: 'active',
            idx: 1
        },
        completed: {
            data: 'completed',
            url: 'completed',
            idx: 2
        },
        all: {
            data: 'all',
            url: 'index.html',
            idx: 0
        }
    },

	changeState: function(e) {
		var target = e.target;
        var curState = this.states[target.innerText.toLowerCase()];

		if (target.tagName === 'A') {
            this.selectNavigator(curState.idx);

            // todo-list ul 에 클래스 추가
			this.todoList.classList.remove(this.todoList.getAttribute('class'));
			this.todoList.classList.add('all-' + curState.data);

            history.pushState({'method': curState.data}, null, curState.url);

			e.preventDefault();
		}
	},
    selectNavigator: function (idx) {
        this.filter.querySelectorAll('a')[this.curIdx].classList.remove('selected');
        this.filter.querySelectorAll('a')[idx].classList.add('selected');
        this.curIdx = idx;
    },
    changeStateBack: function(e) {
        var curState = this.states[e.state.method];

        this.selectNavigator(curState.idx);
        this.todoList.classList.remove(this.todoList.getAttribute('class'));
        this.todoList.classList.add('all-' + curState.data);
    },
	init: function() {
		this.filter.addEventListener('click', this.changeState.bind(this), false);
        window.addEventListener('popstate', this.changeStateBack.bind(this), false);
	}
};

// 서버에 ajax 요청 보내는 객체
var TODOSynk = {
	host: 'http://ui.nhnnext.org:3333/Jehyeok/',
	xhr: null,

	setXhr: function(param, callback) {
		var key = param.key || '';

		this.xhr = new XMLHttpRequest();
		this.xhr.open(param.method, this.host + key, true);
		this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		this.xhr.addEventListener('load', function(e) {
			callback(this.responseText);
		});
	},
	add: function(param, callback) {
		this.setXhr(param, callback);
		this.xhr.send('todo=' + param['todo']);
	},
	get: function(param, callback) {
		this.setXhr(param, callback);
		this.xhr.send();
	},
	complete: function(param, callback) {
		this.setXhr(param, callback);
		this.xhr.send('completed=' + param['completed']);	
	},
	delete: function(param, callback) {
		this.setXhr(param, callback);
		this.xhr.send();
	}
};

// TODO list CRUD 객체
var TODO = {
	todoList: document.getElementById('todo-list'),
	todoInput: document.getElementById('new-todo'),
	todoTemplate: _.template(document.getElementById('todo').innerHTML),
	KEY_CODE_ENTER: 13,

	make: function(param) {
		var todo = this.todoTemplate({
			value: param.value,
			className: param.className,
			key: param.key,
			checked: param.checked
		});

		return todo;
	},
	add: function(e) {
		var keyCode = e.keyCode;
	
		if (keyCode === this.KEY_CODE_ENTER) {
			var inputValue = this.todoInput.value;

			if (navigator.onLine) {
				TODOSynk.add({
					todo: inputValue,
					method: 'PUT'
				}, function(res) {
					var todo = this.make({
						value: this.todoInput.value
					});
					var addedTODO = null;

					this.todoList.insertAdjacentHTML('afterbegin', todo);
					addedTODO = this.todoList.firstElementChild;
					// add 할 때, opacity 애니메이션 실행
					addedTODO.offsetHeight;
					addedTODO.className = 'append';

					this.todoInput.value = '';
				}.bind(this));	
			} else {
				// 클라이언트 저장
			}
		}
	},
	destroy: function(deleteBtn) {
		// todo 제거
		var todo = deleteBtn.parentNode.parentNode;

		TODOSynk.delete({
			key: todo.dataset.key,
			method: 'DELETE'
		}, function(res) {
			todo.className = 'delete';

			todo.addEventListener('transitionend', function(e) {
				// X 여러번 클릭 시, 에러 방지
				if (todo.parentNode === null) return;
				// opacity 속성이 0 이 됐을 때 제거
				if (e.target.tagName === 'LI') this.todoList.removeChild(todo);
			}.bind(this), false)
		}.bind(this));
	},
	get: function() {
		TODOSynk.get({
			method: 'GET'
		},function(res) {
			var todos = JSON.parse(res);
			var todo = null;
			var getTodos = '';

			todos.map(function(todoObj) {
				todo = this.make({
					value: todoObj.todo,
					className: todoObj.completed === 1 ? 'completed' : 'append',
					key: todoObj.id,
					checked: todoObj.completed === 1 ? 'checked' : null
				});
				
				getTodos += todo;
			}, this);

			this.todoList.insertAdjacentHTML('beforeend', getTodos);
		}.bind(this));
	},
	complete: function(input) {
		var todo = input.parentNode.parentNode;

		TODOSynk.complete({
			key: todo.dataset.key,
			completed: input.checked ? '1' : '0',
			method: 'POST'
		}, function(res) {
			console.log(res);
			if (input.checked === true) todo.className = 'completed';
			else todo.className = 'append';
		});
	},
	liClick: function(e) {
		ele = e.target;
		this[ele.className](ele);
	},
	init: function() {
		this.todoInput.addEventListener('keydown', this.add.bind(this), false);
		this.todoList.addEventListener('click', this.liClick.bind(this), false);
		this.get();
	}
};

TODO.init();
TODOSynchronizer.init();
TODOFilter.init();