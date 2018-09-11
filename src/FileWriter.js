const fs = require('fs');
const DEFAULT_SEPARATOR = '|';
const NEW_LINE = '\n';

/*
 * @title It writes into a file the issues using a custom view.
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 */
function FileWriter(_filename, _separator) {
    if (!(this instanceof FileWriter)) {
        return new FileWriter();
    }
    this.filename = _filename;
    this.separator = _separator || DEFAULT_SEPARATOR;
}

FileWriter.prototype.write = function write(issues, views) {
    const __separator = this.separator;
    const stream = fs.createWriteStream(this.filename);
    stream.once('open', async function(fd) {
        views.forEach((v, i) => {
            try {
                stream.write(v.display);
                if(views.length !== i + 1) {
                    stream.write(__separator);
                }
            } catch(error) {
                console.log(error);
            }
        });
        stream.write(NEW_LINE);

        issues.forEach( issue => {
            views.forEach((field, index) => {
                const value = field.get(issue);
                stream.write(value.toString());
                if(views.length !== index + 1) {
                    stream.write(__separator);
                }
            });
            stream.write(NEW_LINE); 
        });
    });
};

module.exports = FileWriter;