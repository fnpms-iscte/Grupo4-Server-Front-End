function formatRequest(rooms_file, lectures_file, id){
    return{
        rooms_file,
        lectures_file,
        id,
    };
}

module.exports = formatRequest;