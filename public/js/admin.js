$(function () {
    $('.del').click(function (e) {
        const event = e || window.event
        const id = $(event.target).data('id')
        const tr = $('.item-id-' + id)
        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id=' + id
        })
        .done(function (result) {
            console.log('result: ', result)
            if (result.status === 1) {
                location.reload()
            }
        })
    })
})