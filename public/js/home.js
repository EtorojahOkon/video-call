joinRoom = () => {
    let name = document.getElementById('name').value

    if(name == '') {
        document.getElementById('error').innerHTML = 'Please enter your name'
        return
    }

    sessionStorage.setItem('username', name)
    window.location.href = '/room'
}