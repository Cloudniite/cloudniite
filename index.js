$(function() {
    $.get('/warmUp');

    $('#Button1').click(() => {
        var date = Date.now();
        $.get('/getLambda1', (data, status) => {
            console.log(data.Name);
        });
    });
    
    $('#Button2').click(() => {
        var date = Date.now();
        $.get('/getLambda2', (data, status) => {
            console.log(data - date);
        });
    });

    $('#Button3').click(() => {
        var date = Date.now();
        $.get('/getLambda3', (data, status) => {
            console.log(data - date);
        });
    });

    $('#go-to-login').click(() => {
        $.get('/warmupLogin', (data, status) => {
            console.log('Status: ', status, 'Data: ', data)
        })
    })
});