import useClickOutside from "./js/hooks/useClickOutside";
import { useEventListener } from "./js/hooks/useEventListener";
import { copyLink, fetchShortLink, getLocalStorageValue, setLocalStorageValue, validUrl } from "./js/utils";
import { exchangeClassName } from "./js/utils/classHelpers";

/*------------------- Nav Stuff -------------------------- */
useClickOutside(document.querySelector('#navDropdownContainer'), () => {
    const navbar_dropdown_content = document.querySelector('#navbarDropdownContent')
    navbar_dropdown_content.className = navbar_dropdown_content.className.replace('collapsed', 'collapse')
})
useEventListener('click', () => {
    const navbar_dropdown_content = document.querySelector('#navbarDropdownContent')
    exchangeClassName(navbar_dropdown_content, 'collapse', 'collapsed')
}, document.querySelector('button[data-target="#navbarDropdownContent"]'))


/*------------------- Create Link Stuff -------------------------- */

/* ------------ Form Stuff ------------- */
    const shortenLinkForm = document.querySelector('.shorten_link_form')
    const setSubmitting = (bool) => {
        shortenLinkForm.setAttribute('data-issubmitting', bool.toString())
    }
    const showInputError = (message) => {
        const elem = document.querySelector('#input-container');
        elem.setAttribute('data-error', message);
        elem.setAttribute('aria-errormessage', 'true')
    } 
    const hideInputError = () => {
        const elem = document.querySelector('#input-container');
        elem.setAttribute('data-error', '');
        elem.setAttribute('aria-errormessage', 'false')
    }

    const validateField = () => {
        const { value } = document.getElementById('link-input')
        switch (true) {
            case value == '' || value == null:
                showInputError('Please add a link')
                break;
            case !validUrl(value):
                showInputError('Please add a valid link')
                break;
            default:
                hideInputError()
                return value
        }

        return false;
    }

    const handleFieldInput = () => {
        validateField()
        return
    }
    const clearInput = () => {
        document.getElementById('link-input').value = ''
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const links = getLocalStorageValue('shortened_links', [])
        const link = validateField()
        if (link) {
            setSubmitting(true)   

            fetchShortLink(link)
            .then(data => {
                links.push({ link: data.result.original_link, short: data.result.short_link2 })
                setLocalStorageValue('shortened_links', links)
            })
            .catch(error => {
                alert(error.message)
            })
            .finally(() => { setSubmitting(false); hideInputError(); clearInput() })
        }
        else{
            return
        }
    }
    useEventListener('input', handleFieldInput, document.querySelector('#link-input'), false)
    useEventListener('submit', handleSubmit, shortenLinkForm)

/* ------------ Card Stuff ------------- */
    const shorten_links_container = document.querySelector('.shortened-links__container')

    const  renderCard = (link, short) => {
        const handleBtnClick = function(e){
            copyLink(short)
        }

        const handleCopyEvt  = e => {
            const ownLink = e.detail === short
            
            if(ownLink) {
                button.innerText = "Copied!"
                button.dataset.copied = true
            }
            else{
                button.innerText = "Copy"
                button.dataset.copied = false
            }
        }

        const card = document.createElement('div')
        card.setAttribute('class', 'shortened-links__card flex')
        
        const h4 = document.createElement('h4')
        h4.setAttribute('class', 'link-card-space'); h4.innerText = link;
        card.appendChild(h4)

        const card_side = document.createElement('div')
        card_side.setAttribute('class', 'card-side flex link-card-space')

        const card_side_span = document.createElement('span')
        card_side_span.innerHTML = `<a href="https://${short}" target="blank">${short}</a>`

        card_side.appendChild(card_side_span)

        const button = document.createElement('button')
        button.setAttribute('class', 'soft-cyan-btn')
        button.innerText = "Copy"
        button.dataset.copied = false
        button.onclick = handleBtnClick
        useEventListener('copylink', handleCopyEvt, window)
        
        card_side.appendChild(button)

        card.appendChild(card_side)

        shorten_links_container.appendChild(card)
    }

    const renderCards = () => {
        const links = getLocalStorageValue('shortened_links', [])

        links.forEach(({ link, short }) => {
            renderCard(link, short)
        })
    }

    renderCards()

    useEventListener('localstorage', (e) => {
        const { link, short } = e.detail[e.detail.length - 1]
        renderCard(link, short)
    }, window)