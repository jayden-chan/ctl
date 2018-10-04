const Table = require('cli-table');

exports.printObj = async (items) => {
  const width = process.stdout.columns;
  const numWidth = Math.floor(width/12)-1;
  const otherWidth = Math.floor(2*width / 9)-1;

  const table = new Table({
    head: ['#', 'Description', 'Folder', 'Due Date', 'Status']
    , colWidths: [5, otherWidth, otherWidth, otherWidth, 10]
  });

  items.forEach((item, i) => {
    table.push(
      [i+1, item.description, item.folder || '', item.due || '', item.status]
    );
  });

  console.log(table.toString());
};
