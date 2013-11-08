var ignoretags = /script/i

var replace_sets = {
    'Cloud to Butt': {
        'regex': [{
            'find': /\b(T|t)he (C|c)loud/g,
            'repl': 'my butt',
            'docaps': true,
        },{
            'find': /\b(P|p)rivate (C|c)loud/g,
            'repl': 'butt',
            'docaps': true,
        },{
            'match': /cloud/i,
            'find': /(C|c)loud/gi,
            'repl': 'butt',
            'context': [
                'PaaS','SaaS','IaaS',
                'computing','data','storage',
                'cluster','distributed',
                'server','hosting','provider',
                'grid','enterprise','provision',
                'apps','hardware','software',
                'icloud','azure','platform',
            ],
            'docaps': true,
        }]
    },
    'xkcd': {
        'simple': {
            'witnesses': 'these dudes I know',
            'allegedly': 'kinda probably',
            'new study': 'tumblr post',
            'rebuild': 'avenge',
            'space': 'spaaace',
            'google glass': 'virtual boy',
            'smartphone': 'pokédex',
            'electric': 'atomic',
            'senator': 'elf-lord',
            'comic threads': 'stuffs',
            'car': 'cat',
            'election': 'eating contest',
            'congressional leaders': 'river spirits',
            'homeland security': 'homestar runner',
            'could not be reached for comment': 'is guilty and everyone knows it',
        }
    }
};

init_sets();    
walk(document.body);

function init_sets() {
    initcaps = /\b(\w)/g
    for(name in replace_sets) {
        matcher = replace_sets[name]; 
        if(!matcher.regex) { matcher.regex = Array(); }

        for(find in matcher.simple) {
            newregex = new RegExp(find.replace(/\b(\w)/g,'($1)'),'ig');
            matcher.regex.push({
                find: newregex,
                repl: matcher.simple[find],
                docaps: true,
            });
        }

        for(idx in matcher.regex) {
            regex = matcher.regex[idx];
            if(regex.context) {
                regex.context = new RegExp(regex.context.join('|'),'i')
            }
            if(regex.docaps) {
                regex.initialcaps = regex.repl.split(initcaps);
            }
        }
    }
}

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			if(!ignoretags.test(node.parentNode.tagName)) {
				handleText(node);
			}
			break;
	}
}

function handleText(textNode) {
	var v = textNode.nodeValue;

    for(name in replace_sets) {
        matcher = replace_sets[name]; 
        for(idx in matcher.regex) {
            regex = matcher.regex[idx];
            if(!regex.match || v.match(regex.match)) {
                if(regex.docaps) {
                    v = v.replace(regex.find, function() {
                        matches = arguments.length - 3;
                        myrepl = '';
                        numcaps = regex.initialcaps.length;
                        for(i=0; i < matches && (i+1)*2 < numcaps; i++) {
                            foundcap = regex.initialcaps[i*2+1];
                            myrepl += regex.initialcaps[i*2];
                            myrepl += (arguments[i+1].charCodeAt(0) < 96) ? foundcap.toUpperCase() : foundcap;
                        }
                        if(numcaps > i*2) {
                            myrepl += regex.initialcaps.slice(i*2).join('');
                        }
                        //console.log("Replaced " + arguments[0] + " with " + myrepl);
                        return myrepl;
                    });
                } else {
                    v = v.replace(regex.find, regex.repl);
                }
            }
        }
    }

	textNode.nodeValue = v;
}


