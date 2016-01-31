<?php

/* @WebProfiler/Collector/router.html.twig */
class __TwigTemplate_a7201bfbb7c646279fe3fceda20f62a5ee3234096717e221d692904290f36e0f extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/router.html.twig", 1);
        $this->blocks = array(
            'toolbar' => array($this, 'block_toolbar'),
            'menu' => array($this, 'block_menu'),
            'panel' => array($this, 'block_panel'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@WebProfiler/Profiler/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_6d7f4a2cda7f75227f97a902ae4f60b58d25b5f4dd0a0f748c78b91161d9ae89 = $this->env->getExtension("native_profiler");
        $__internal_6d7f4a2cda7f75227f97a902ae4f60b58d25b5f4dd0a0f748c78b91161d9ae89->enter($__internal_6d7f4a2cda7f75227f97a902ae4f60b58d25b5f4dd0a0f748c78b91161d9ae89_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/router.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_6d7f4a2cda7f75227f97a902ae4f60b58d25b5f4dd0a0f748c78b91161d9ae89->leave($__internal_6d7f4a2cda7f75227f97a902ae4f60b58d25b5f4dd0a0f748c78b91161d9ae89_prof);

    }

    // line 3
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_0c8fade360474d50799973a04046f0893540267e35948d8abe4710114cf1fe0e = $this->env->getExtension("native_profiler");
        $__internal_0c8fade360474d50799973a04046f0893540267e35948d8abe4710114cf1fe0e->enter($__internal_0c8fade360474d50799973a04046f0893540267e35948d8abe4710114cf1fe0e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        
        $__internal_0c8fade360474d50799973a04046f0893540267e35948d8abe4710114cf1fe0e->leave($__internal_0c8fade360474d50799973a04046f0893540267e35948d8abe4710114cf1fe0e_prof);

    }

    // line 5
    public function block_menu($context, array $blocks = array())
    {
        $__internal_5a99a7bb4994e42de85d691b2b2e91321588990a6975f553f631770c47e82c3a = $this->env->getExtension("native_profiler");
        $__internal_5a99a7bb4994e42de85d691b2b2e91321588990a6975f553f631770c47e82c3a->enter($__internal_5a99a7bb4994e42de85d691b2b2e91321588990a6975f553f631770c47e82c3a_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 6
        echo "<span class=\"label\">
    <span class=\"icon\">";
        // line 7
        echo twig_include($this->env, $context, "@WebProfiler/Icon/router.svg");
        echo "</span>
    <strong>Routing</strong>
</span>
";
        
        $__internal_5a99a7bb4994e42de85d691b2b2e91321588990a6975f553f631770c47e82c3a->leave($__internal_5a99a7bb4994e42de85d691b2b2e91321588990a6975f553f631770c47e82c3a_prof);

    }

    // line 12
    public function block_panel($context, array $blocks = array())
    {
        $__internal_e382cc927acdfb6869e52fc27a8f363ea198a7a797afeee3c9c0d6096694dc62 = $this->env->getExtension("native_profiler");
        $__internal_e382cc927acdfb6869e52fc27a8f363ea198a7a797afeee3c9c0d6096694dc62->enter($__internal_e382cc927acdfb6869e52fc27a8f363ea198a7a797afeee3c9c0d6096694dc62_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 13
        echo "    ";
        echo $this->env->getExtension('http_kernel')->renderFragment($this->env->getExtension('routing')->getPath("_profiler_router", array("token" => (isset($context["token"]) ? $context["token"] : $this->getContext($context, "token")))));
        echo "
";
        
        $__internal_e382cc927acdfb6869e52fc27a8f363ea198a7a797afeee3c9c0d6096694dc62->leave($__internal_e382cc927acdfb6869e52fc27a8f363ea198a7a797afeee3c9c0d6096694dc62_prof);

    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/router.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  73 => 13,  67 => 12,  56 => 7,  53 => 6,  47 => 5,  36 => 3,  11 => 1,);
    }
}
/* {% extends '@WebProfiler/Profiler/layout.html.twig' %}*/
/* */
/* {% block toolbar %}{% endblock %}*/
/* */
/* {% block menu %}*/
/* <span class="label">*/
/*     <span class="icon">{{ include('@WebProfiler/Icon/router.svg') }}</span>*/
/*     <strong>Routing</strong>*/
/* </span>*/
/* {% endblock %}*/
/* */
/* {% block panel %}*/
/*     {{ render(path('_profiler_router', { token: token })) }}*/
/* {% endblock %}*/
/* */
