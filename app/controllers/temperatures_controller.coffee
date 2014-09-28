load 'application'

before 'load temperature', ->
  Temperature.find params.id, (err, temperature) =>
    if err || !temperature
      if !err && !temperature && params.format == 'json'
        return send code: 404, error: 'Not found'
      redirect pathTo.temperatures
    else
      @temperature = temperature
      next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
  @temperature = new Temperature
  @title = 'New temperature'
  render()

action 'create', ->
  Temperature.create body.Temperature, (err, temperature) =>
    respondTo (format) =>
      format.json ->
        if err
          send code: 500, error: temperature.errors || err
        else
          send code: 200, data: temperature.toObject()
      format.html =>
        if err
          flash 'error', 'Temperature can not be created'
          @temperature = temperature
          @title = 'New temperature'
          render 'new'
        else
          flash 'info', 'Temperature created'
          redirect pathTo.temperatures

action 'index', ->
  Temperature.all (err, temperatures) =>
    @temperatures = temperatures
    @title = 'Temperature index'
    respondTo (format) ->
      format.json ->
        send code: 200, data: temperatures
      format.html ->
        render temperatures: temperatures

action 'show', ->
  @title = 'Temperature show'
  respondTo (format) =>
    format.json =>
      send code: 200, data: @temperature
    format.html ->
      render()

action 'edit', ->
  @title = 'Temperature edit'
  respondTo (format) =>
    format.json =>
      send code: 200, data: @temperature
    format.html ->
      render()

action 'update', ->
  @temperature.updateAttributes body.Temperature, (err) =>
    respondTo (format) =>
      format.json =>
        if err
          send code: 500, error: @temperature.errors || err
        else
          send code: 200, data: @temperature
      format.html =>
        if !err
          flash 'info', 'Temperature updated'
          redirect path_to.temperature(@temperature)
        else
          flash 'error', 'Temperature can not be updated'
          @title = 'Edit temperature details'
          render 'edit'

action 'destroy', ->
  @temperature.destroy (error) ->
    respondTo (format) ->
      format.json ->
        if error
          send code: 500, error: error
        else
          send code: 200
      format.html ->
        if error
          flash 'error', 'Can not destroy temperature'
        else
          flash 'info', 'Temperature successfully removed'
        send "'" + path_to.temperatures + "'"
