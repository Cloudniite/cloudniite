$(function() {
    $('#signup').click(() => {
        console.log('singup got smashed')
        $.get('/signup', (data, status) => {
            // $('body').replaceWith(data);
            // console.log(data);
        });
    });

    $('#go-to-login').click(() => {
        $.get('/warmupLogin', (data, status) => {
            console.log('Status: ', status, 'Data: ', data)
        })
    })
});