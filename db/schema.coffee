# Example of model definition:
#
#define 'User', ->
#  property 'email', String, index: true
#  property 'password', String
#  property 'activated', Boolean, default: false
#

Temperature = describe 'Temperature', ->
    property 'value', Number
    property 'readingOn', Date
    property 'timestamp', { type: Number, default: -> Date.now }
    set 'restPath', pathTo.temperatures

