var TODO = {
	todoList: document.getElementById('todo-list'),
	todoInput: document.getElementById('new-todo'),
	todoTemplate: _.template(document.getElementById('todo').innerHTML),
	KEY_CODE_ENTER: 13,

	make: function(inputValue) {
		var todo = this.todoTemplate({value: inputValue});

		return todo;
	},
	add: function(e) {
		var keyCode = e.keyCode;
	
		if (keyCode === this.KEY_CODE_ENTER) {
			var todo = this.make(this.todoInput.value);
			var addedTODO = null;

			this.todoList.insertAdjacentHTML('beforeend', todo);
			addedTODO = this.todoList.lastElementChild;
			// add 할 때, opacity 애니메이션 실행
			addedTODO.offsetHeight;
			addedTODO.className = 'appended';

			this.todoInput.value = '';
		}
	},
	remove: function(deleteBtn) {
		// todo 제거
		var todo = deleteBtn.parentNode.parentNode;
		todo.className = 'deleted';

		todo.addEventListener('transitionend', function(e) {
			if (todo.parentNode === null) return;
			if (e.target.tagName === 'LI') this.todoList.removeChild(todo);
		}.bind(this), false)
	},
	complete: function(input) {
		var todo = input.parentNode.parentNode;

		if (input.checked === true) todo.className = 'completed';
		else todo.className = 'appended';	
	},
	liClick: function(e) {
		ele = e.target;
	
		if (ele.tagName === 'BUTTON') this.remove(ele);
		else if (ele.tagName === 'INPUT') this.complete(ele);
	},
	init: function() {
		this.todoInput.addEventListener('keydown', this.add.bind(this), false);
		this.todoList.addEventListener('click', this.liClick.bind(this), false);	
	}
};

TODO.init();