class Room {

	building;
	name;
	normal_capacity;
	exam_capacity;
	characteristics = [];

	constructor(building, name, normal_capacity, exam_capacity, characteristics) {
		this.building = building;
		this.name = name;
		this.normal_capacity = normal_capacity;
		this.exam_capacity = exam_capacity;
		this.characteristics = characteristics;
	}

	get building() {
		return this.building;
	}

	get name() {
		return this.name;
	}

	get normalCapacity() {
		return this.exam_capacity;
	}
	get examCapacity() {
		return this.exam_capacity;
	}
	
	get characteristics(){
		return this.characteristics;
	}
}