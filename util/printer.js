const Table = require('cli-table2');

exports.printObj = async (items) => {
  const width = process.stdout.columns;
  const dynamicWidth = Math.min(Math.floor((width - 15) / 3)-2, 35);

  const table = new Table({
    head: ['Key', 'Description', 'Folder', 'Due Date', 'Status'], 
    colWidths: [5, dynamicWidth, dynamicWidth, dynamicWidth, 10],
    wordWrap: true
  });

  items.forEach((item, i) => {
    table.push(
      [item.index, item.description, item.folder || '', item.due || '', item.status]
    );
  });

  console.log(table.toString());
};
