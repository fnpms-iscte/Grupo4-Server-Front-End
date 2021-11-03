class Lecture {

	course;
	name;
	shift;
	class_name;
	n_students;
	week_day;
	date;
	start;
	end;
	required_room_characteristics;
	too_many_students_room_exam;
	too_many_students_room;
	room;


	constructor(course, name, shift, class_name, n_students, week_day, date, start, end, required_room_characteristics) {
		this.course = course;
		this.name = name;
		this.shift = shift;
		this.class_name = class_name;
		this.n_students = n_students;
		this.week_day = week_day;
		this.date = date;
		this.start = start
		this.end = end;
		this.required_room_characteristics = required_room_characteristics;
	}

	get course() {
		return this.course;
	}

	get name() {
		return this.name;
	}

	get shift() {
		return this.shift;
	}

	get class_name() {
		return this.class_name;
	}

	get n_students() {
		return this.n_students;
	}

	get week_day() {
		return this.week_day;
	}

	get date() {
		return this.date;
	}

	get start() {
		return this.start;
	}

	get end() {
		return this.end;
	}

	get required_room_characteristics() {
		return this.required_room_characteristics;
	}

	get too_many_students_room_exam() {
		return this.too_many_students_room_exam;
	}
	set too_many_students_room_exam(boolean) {
		this.too_many_students_room_exam = boolean;
	}

	get too_many_students_room() {
		return this.too_many_students_room;
	}
	set too_many_students_room(boolean) {
		this.too_many_students_room = boolean;
	}

	get room() {
		return this.room;
	}

	set room(room) {
		this.room = room;
	}
}