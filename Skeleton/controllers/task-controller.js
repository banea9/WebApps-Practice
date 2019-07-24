const Task = require('../models/Task')

module.exports = {
  getIndex: function (req, res) {
    function compareFunction(a, b) {
      let aDate = a.date;
      let bDate = b.date;
      return aDate.localeCompare(bDate)
    }
    Task
      .find({})
      .then((allTasks) => {
        const openTasks = allTasks.filter(t => t.status === 'Open').sort(compareFunction);
        const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').sort(compareFunction);
        const finishedTasks = allTasks.filter(t => t.status === 'Finished').sort(compareFunction);
        res.render('index', { openTasks, inProgressTasks, finishedTasks });
      })

  },
  getCreate: function (req, res) {
    res.render('create')
  },
  postCreate: function (req, res) {
    console.log(req.body)
    Task.create({
      title: req.body.title,
      status: req.body.status,
      date: req.body.date.split('T').join(' / ')
    }).then(res.redirect('/'))


  },
  getEdit: function (req, res) {
    
    const id = req.params.id;
    Task.findById(id).then((task) => {
      task.open = task.status === 'Open';
      task.inProgress = task.status === 'In Progress';
      task.finished = task.status === 'Finished';
      task.dateCheck = task.date.length > 0  
      res.render('edit', { task })
    })

  },
  postEdit: function (req, res) {
    const id = req.params.id;
    Task.findByIdAndUpdate(id, { status: req.body.status, date: req.body.date }).then(() => {
      res.redirect('/')
    })
  },
  getDelete: function (req, res) {
    const id = req.params.id;
    Task.findById(id).then((task) => {
      task.open = task.status === 'Open';
      task.inProgress = task.status === 'In Progress';
      task.finished = task.status === 'Finished';
      res.render('delete', { task })
    })
  },
  postDelete: function (req, res) {
    const id = req.params.id;
    Task.findByIdAndRemove(id).then(res.redirect('/'))
  }
};