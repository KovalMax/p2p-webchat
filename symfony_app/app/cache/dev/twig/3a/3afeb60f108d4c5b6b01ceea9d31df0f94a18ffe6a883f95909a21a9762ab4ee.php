<?php

/* base.html.twig */
class __TwigTemplate_9f672b8b6f1f2994efaacc2a990e012c0f2a9deca6127ec93ae1cb93b3f060c3 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
            'title' => array($this, 'block_title'),
            'stylesheets' => array($this, 'block_stylesheets'),
            'body' => array($this, 'block_body'),
            'javascripts' => array($this, 'block_javascripts'),
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_e5305c7d07f518b350aaa67058d1c4ca8fd8fe3640a00da51915d8c9516b1c8e = $this->env->getExtension("native_profiler");
        $__internal_e5305c7d07f518b350aaa67058d1c4ca8fd8fe3640a00da51915d8c9516b1c8e->enter($__internal_e5305c7d07f518b350aaa67058d1c4ca8fd8fe3640a00da51915d8c9516b1c8e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "base.html.twig"));

        // line 1
        echo "<!DOCTYPE html>
<html>
    <head>
        <meta charset=\"UTF-8\" />
        <title>";
        // line 5
        $this->displayBlock('title', $context, $blocks);
        echo "</title>
        ";
        // line 6
        $this->displayBlock('stylesheets', $context, $blocks);
        // line 7
        echo "        <link rel=\"icon\" type=\"image/x-icon\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('asset')->getAssetUrl("favicon.ico"), "html", null, true);
        echo "\" />
    </head>
    <body>
        ";
        // line 10
        $this->displayBlock('body', $context, $blocks);
        // line 11
        echo "        ";
        $this->displayBlock('javascripts', $context, $blocks);
        // line 12
        echo "    </body>
</html>
";
        
        $__internal_e5305c7d07f518b350aaa67058d1c4ca8fd8fe3640a00da51915d8c9516b1c8e->leave($__internal_e5305c7d07f518b350aaa67058d1c4ca8fd8fe3640a00da51915d8c9516b1c8e_prof);

    }

    // line 5
    public function block_title($context, array $blocks = array())
    {
        $__internal_f00409e50de956201c18b23aa65e2f840e35528f325d3f1ab91b991e9327643d = $this->env->getExtension("native_profiler");
        $__internal_f00409e50de956201c18b23aa65e2f840e35528f325d3f1ab91b991e9327643d->enter($__internal_f00409e50de956201c18b23aa65e2f840e35528f325d3f1ab91b991e9327643d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        echo "Welcome!";
        
        $__internal_f00409e50de956201c18b23aa65e2f840e35528f325d3f1ab91b991e9327643d->leave($__internal_f00409e50de956201c18b23aa65e2f840e35528f325d3f1ab91b991e9327643d_prof);

    }

    // line 6
    public function block_stylesheets($context, array $blocks = array())
    {
        $__internal_38a593e367b318c92de266102819f1971270a95db31de1bcd1b014d6f7edcbea = $this->env->getExtension("native_profiler");
        $__internal_38a593e367b318c92de266102819f1971270a95db31de1bcd1b014d6f7edcbea->enter($__internal_38a593e367b318c92de266102819f1971270a95db31de1bcd1b014d6f7edcbea_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "stylesheets"));

        
        $__internal_38a593e367b318c92de266102819f1971270a95db31de1bcd1b014d6f7edcbea->leave($__internal_38a593e367b318c92de266102819f1971270a95db31de1bcd1b014d6f7edcbea_prof);

    }

    // line 10
    public function block_body($context, array $blocks = array())
    {
        $__internal_57a0b7d91e64528b62f537f50f9cf2577e76fe6bf9884e22e6928ee438e116ba = $this->env->getExtension("native_profiler");
        $__internal_57a0b7d91e64528b62f537f50f9cf2577e76fe6bf9884e22e6928ee438e116ba->enter($__internal_57a0b7d91e64528b62f537f50f9cf2577e76fe6bf9884e22e6928ee438e116ba_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        
        $__internal_57a0b7d91e64528b62f537f50f9cf2577e76fe6bf9884e22e6928ee438e116ba->leave($__internal_57a0b7d91e64528b62f537f50f9cf2577e76fe6bf9884e22e6928ee438e116ba_prof);

    }

    // line 11
    public function block_javascripts($context, array $blocks = array())
    {
        $__internal_71ef60d8d4e4b2e0dca84bdaaa29410f39aee1b7a075ff8b9df0c678849ea852 = $this->env->getExtension("native_profiler");
        $__internal_71ef60d8d4e4b2e0dca84bdaaa29410f39aee1b7a075ff8b9df0c678849ea852->enter($__internal_71ef60d8d4e4b2e0dca84bdaaa29410f39aee1b7a075ff8b9df0c678849ea852_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "javascripts"));

        
        $__internal_71ef60d8d4e4b2e0dca84bdaaa29410f39aee1b7a075ff8b9df0c678849ea852->leave($__internal_71ef60d8d4e4b2e0dca84bdaaa29410f39aee1b7a075ff8b9df0c678849ea852_prof);

    }

    public function getTemplateName()
    {
        return "base.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  93 => 11,  82 => 10,  71 => 6,  59 => 5,  50 => 12,  47 => 11,  45 => 10,  38 => 7,  36 => 6,  32 => 5,  26 => 1,);
    }
}
/* <!DOCTYPE html>*/
/* <html>*/
/*     <head>*/
/*         <meta charset="UTF-8" />*/
/*         <title>{% block title %}Welcome!{% endblock %}</title>*/
/*         {% block stylesheets %}{% endblock %}*/
/*         <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />*/
/*     </head>*/
/*     <body>*/
/*         {% block body %}{% endblock %}*/
/*         {% block javascripts %}{% endblock %}*/
/*     </body>*/
/* </html>*/
/* */
