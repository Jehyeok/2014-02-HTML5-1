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
		var addedTODO = null;

		todoList.insertAdjacentHTML('beforeend', todo);
		addedTODO = todoList.lastElementChild;
		addedTODO.offsetHeight;
		addedTODO.className = 'appended';

		this.value = '';
	}
}

function check(input) {
	var todo = input.parentNode.parentNode;

	if (input.checked === true) todo.className = 'completed';
	else todo.className = 'appended';
}

function removeTODO(button) {
	// todo 제거
	var todo = button.parentNode.parentNode;
	todo.className = 'deleted';

	todo.addEventListener('transitionend', function removeLI(e) {
		if (todo.parentNode === null) return;
		if (e.target.tagName === 'LI') todoList.removeChild(todo);
	}, false)
}

function liClick(e) {
	ele = e.target;
	
	if (ele.tagName === 'BUTTON') removeTODO(ele);
	else if (ele.tagName === 'INPUT') check(ele);
}

todoInput.addEventListener('keydown', insertTODO, false);
todoList.addEventListener('click', liClick, false);