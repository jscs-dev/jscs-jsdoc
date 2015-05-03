var jsdoc = require('../../lib/jsdoc');
var expect = require('chai').expect;

describe('jsdoc', function() {
    var Location = jsdoc.location;
    var Type = jsdoc.type;
    var Tag = jsdoc.tag;
    var Comment = jsdoc.doc;

    describe('inline comment block', function() {
        var c1;

        before(function() {
            c1 = new Comment('/** @tag1 */', {start: {line: 1, column: 0}});
        });

        it('should parses tag', function() {
            expect(c1.tags.length).to.eq(1);

            var tag1 = c1.tags[0];
            expect(tag1.id).to.eq('tag1');
        });

    });

    describe('location', function() {

        it('should create valid location', function() {
            var loc = new Location(4, 5);
            expect(loc.line).to.eq(4);
            expect(loc.column).to.eq(5);
        });

        it('should throws without params', function() {
            expect(function() {
                new Location();
            }).to.throw(/should be/);
        });

        it('should shift location by line and column', function() {
            var loc = new Location(1, 2);
            var shifted = loc.shift(3, 4);
            expect(shifted.line).to.eq(4);
            expect(shifted.column).to.eq(6);
        });

        it('should shift location by location', function() {
            var loc = new Location(1, 2);
            var shifted = loc.shift({line: 3, column: 4});
            expect(shifted.line).to.eq(4);
            expect(shifted.column).to.eq(6);
        });

    });

    describe('type', function() {
        var bool1;
        var varnum;
        var nullie;

        before(function() {
            bool1 = new Type('boolean', new Location(3, 4));
            varnum = new Type('...number', new Location(10, 20));
            nullie = new Type('Null|null', new Location(2, 5));
        });

        it('should store data', function() {
            expect(bool1.value).to.eq('boolean');
            expect(bool1.loc.line).to.eq(3);
            expect(bool1.loc.column).to.eq(4);
            expect(varnum.variable).to.eq(true);
            expect(varnum.loc.line).to.eq(10);
            expect(varnum.loc.column).to.eq(23);
        });

        it('should match types', function() {
            expect(bool1.match({type: 'Literal', value: true})).to.eq(true);
            expect(bool1.match({type: 'Literal', value: null})).to.eq(false);
        });

        it('should parse null', function() {
            var passed = '';
            nullie.iterate(function(type) {
                if (type.typeName === 'Null') {
                    passed += 1;
                }
                if (type.typeName === 'null') {
                    passed += 2;
                }
            });
            expect(passed).to.eq('12');
        });
    });

    describe('tag', function() {

        it('should parses type and set right absolute locations', function() {
            var age = new Tag({
                line: 5,
                value: '@param {Number} age User`s age',
                tag: 'param',
                type: 'Number',
                name: 'age',
                description: 'User`s age'
            }, new Location(10, 20));

            expect(age.name).to.be.an('object');
            expect(age.name.loc).to.be.an.instanceof(Location);
            expect(age.name.loc.line).to.eq(10);
            expect(age.name.loc.column).to.eq(36);

            expect(age.type).to.be.an.instanceof(Type);
            expect(age.type.value).to.eq('Number');
            expect(age.type.loc).to.be.an.instanceof(Location);
            expect(age.type.loc.line).to.eq(10);
            expect(age.type.loc.column).to.eq(28);
            expect(age.type.match({type: 'Literal', value: 4})).to.eq(true);
        });

    });

    describe('comment', function() {
        var c1;

        before(function() {
            c1 = new Comment(
                '/**\n' +
                ' * Description\n' +
                ' *   with a new line\n' +
                ' *\n' +
                ' * @tag1 value\n' +
                ' * @param {Type} some long\n' +
                ' *   description of param\n' +
                ' * @abstract\n' +
                ' * @example\n' +
                ' * // use this anywhere\n' +
                ' * makeFun(value, some);\n' +
                ' */', {start: {line: 5, column: 2}});
        });

        it('should parses comment and create all tags and types', function() {
            expect(c1.description).to.eq('Description\n  with a new line\n');
            expect(c1.tags.length).to.eq(4);

            var tag1 = c1.tags[0];
            expect(tag1.id).to.eq('tag1');
            expect(tag1.loc).to.eql(new Location(9, 5));
            expect(tag1.name.value).to.eq('value');
            expect(tag1.name.loc).to.eql(new Location(9, 11));

            var param = c1.tags[1];
            expect(param.id).to.eq('param');
            expect(param.loc).to.eql(new Location(10, 5));
            expect(param.type.value).to.eq('Type');
            expect(param.type.loc).to.eql(new Location(10, 13));
            expect(param.name.value).to.eq('some');
            expect(param.name.loc).to.eql(new Location(10, 19));

            var abs = c1.tags[2];
            expect(abs.id).to.eq('abstract');
            expect(abs.loc).to.eql(new Location(12, 5));

            var example = c1.tags[3];
            expect(example.id).to.eq('example');
            expect(example.type).to.eq(undefined);
            expect(example.name).to.eq(undefined);
            expect(example.description).to.eq('// use this anywhere\nmakeFun(value, some);');
        });

    });

});
