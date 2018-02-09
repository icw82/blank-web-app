if (!('camelize' in kk)) {
    kk.camelize = input => input.split('-').map(item =>
        item.charAt(0).toUpperCase() +
        item.substr(1).toLowerCase()
    ).join('');
}
