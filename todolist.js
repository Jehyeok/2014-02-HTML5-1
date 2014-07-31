// 상수
var KEY_CODE_ENTER = 13;

var todoList = document.getElementById('todo-list');
var todoInput = document.getElementById('new-todo');

function getTodo(inputValue) {
	var todoTemplate = _.template(document.getElementById('todo').innerHTML);
	
	var todo = todoTemplate({value: inputValue});

	return todo;
}

function insertTODO(e) {
	var keyCode = e.keyCode;
	
	if (keyCode === KEY_CODE_ENTER) {
		var todo = getTodo(this.value);

		todoList.insertAdjacentHTML('beforeend', todo);
		todoList.lastElementChild.className = 'appended';

		this.value = '';

		// 리무브 이벤트 등록
		addRemoveEventToNewElement(todoList);
		addCheckEventToNewElement(todoList);
	}
}

function addRemoveEventToNewElement() {
	var todo = todoList.lastElementChild;
	
	// 리무브 이벤트 등록
	todo.querySelector('.destroy').addEventListener('click', removeTODO.bind(this, todoList), false);
}

function addCheckEventToNewElement() {
	var todo = todoList.lastElementChild;

	todo.querySelector('input').addEventListener('click', check, false);
}

function check(e) {
	var todo = e.target.parentNode.parentNode;

	if (this.checked === true) todo.className = 'completed';
	else todo.className = 'appended';
}

function removeTODO(todoList, e) {
	// todo 제거
	var todo = e.target.parentNode.parentNode;
	todo.className = 'deleted';

	todo.addEventListener('transitionend', function(e) {
		if (e.target.tagName === 'LI') todoList.removeChild(todo);
	}, false);
}

todoInput.addEventListener('keydown', insertTODO, false);